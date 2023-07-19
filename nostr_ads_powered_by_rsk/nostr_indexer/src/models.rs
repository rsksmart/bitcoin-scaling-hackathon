use sqlx::{
  postgres::{PgPoolOptions, PgConnectOptions},
  types::chrono::{DateTime, Utc, TimeZone},
};
pub use sqlx_models_orm::{Db, model};
use std::str::FromStr;
use serde::{Serialize, Deserialize};

use futures_util::{SinkExt, StreamExt};
use tokio_tungstenite::{
  WebSocketStream,
  MaybeTlsStream,
  connect_async,
  tungstenite::{ Result, Message as WsMessage, },
};
use tokio::net::TcpStream;
use url::Url;
use tokio::time::{sleep, Duration};
use anyhow::Context;
pub type UtcDateTime = DateTime<Utc>;

type Wss = WebSocketStream<MaybeTlsStream<TcpStream>>;

use nostr_sdk::nostr::{
  UncheckedUrl,
  key::XOnlyPublicKey,
  Event,
  EventId,
  Tag,
  Kind,
  ClientMessage,
  Filter,
  RelayMessage,
  SubscriptionId,
};

#[derive(Debug, thiserror::Error)]
pub enum EventProcessingError {
  #[error(transparent)]
  Database(#[from] sqlx::Error),
  #[error(transparent)]
  Generic(#[from] anyhow::Error),
  #[error(transparent)]
  Websocket(#[from] tokio_tungstenite::tungstenite::Error),
  #[error("Error connecting to relay {0}")]
  RelayConnect(String),
  #[error(transparent)]
  Secp256k1(#[from] nostr_sdk::secp256k1::Error),
  #[error(transparent)]
  Serde(#[from] serde_json::Error),
  #[error(transparent)]
  Event(#[from] nostr_sdk::event::Error),
}

impl EventProcessingError {
  pub fn text_and_json(&self) -> (&'static str, serde_json::Value) {
    match self {
      Self::Database(err) => ("database_error", serde_json::json!{err.to_string()}),
      Self::Generic(err) => ("generic_anyhow_error", serde_json::json!{err.to_string()}),
      Self::Websocket(tokio_tungstenite::tungstenite::Error::Http(response)) => 
        ("tungstenite_http_error", serde_json::json!{{"error": response.body().as_ref().map(|b| String::from_utf8_lossy(&b) )}}),
      Self::RelayConnect(err) => ("tungstenite_relay_connect", serde_json::json!{{"error": err}}),
      Self::Websocket(err) => ("tungstenite_other_error", serde_json::json!(err.to_string())),
      Self::Secp256k1(err) => ("invalid_pubkey", serde_json::json!(err.to_string())),
      Self::Serde(err) => ("serialize_deserialize", serde_json::json!(err.to_string())),
      Self::Event(err) => ("event_verification_error", serde_json::json!(err.to_string())),
    }
  }
}

type ProcessingResult<T> = Result<T, EventProcessingError>;

#[derive(Clone)]
pub struct Site {
  pub db: Db,
}

impl Site {
  pub async fn new() -> anyhow::Result<Self> {
    let conn_string = std::env::var("DATABASE_URL")?;
    let options = PgConnectOptions::from_str(&conn_string)?;
    let pool_options = PgPoolOptions::new().max_connections(50);
    let pool = pool_options.connect_with(options).await?;
    let db = Db{ pool, transaction: None };

    Ok(Self { db })
  }
}

model!{
  state: Site,
  table: pubkeys,
  struct DbPubkey {
    #[sqlx_model_hints(varchar)]
    id: String,
    #[sqlx_model_hints(timestamptz, default)]
    first_found_at: UtcDateTime,
  },
  has_many{
    DbEvent(pubkey_id), // The events this pubkey has authored.
    DbPubkeySource(pubkey_id), // The events that point to this pubkey, as the author or in their tags.
  }
}

impl DbPubkeyHub {
  pub async fn create_if_missing(&self, pk: &XOnlyPublicKey) -> sqlx::Result<DbPubkey> {
    let id = pk.to_string();
    self.state.db.execute(sqlx::query!("INSERT INTO pubkeys (id) VALUES ($1) ON CONFLICT DO NOTHING", id)).await?;
    self.find(&id).await
  }

  pub async fn add(&self, event_id: &EventId, pk: &XOnlyPublicKey) -> sqlx::Result<DbPubkey> {
    let db_pubkey = self.create_if_missing(pk).await?;
    let db_event = self.state.db_event().find(&event_id.to_string()).await?;
    db_pubkey.register_source(&db_event).await?;
    Ok(db_pubkey)
  }
}

impl DbPubkey {
  pub async fn register_source(&self, event: &DbEvent) -> sqlx::Result<()> {
    self.state.db_pubkey_source().insert(InsertDbPubkeySource{
      pubkey_id: self.attrs.id.clone(),
      event_id: event.attrs.id.clone(),
    }).save().await?;
    Ok(())
  }
}

model!{
  state: Site,
  table: events,
  struct DbEvent {
    #[sqlx_model_hints(varchar)]
    id: String,
    #[sqlx_model_hints(text)]
    payload: String,
    #[sqlx_model_hints(timestamptz)]
    created_at: UtcDateTime,
    #[sqlx_model_hints(varchar)]
    pubkey_id: String,
    #[sqlx_model_hints(int4)]
    kind: i32,
  },
  belongs_to{
    DbPubkey(pubkey_id), // The pubkey that authored the event.
  },
  has_many {
    DbPubkeySource(event_id), // All the pubkeys mentioned in this event.
    DbEventSource(event_id), // All the relays that provided this event.
  }
}

impl DbEventHub {
  pub async fn add(&self, event: Event, relay_id: &str) -> ProcessingResult<(DbEvent, Vec<EventId>)> {
    let mut other_event_ids = vec![];

    let db_pubkey = self.state.db_pubkey().create_if_missing(&event.pubkey).await?;

    let created_at = Utc.timestamp_millis_opt(event.created_at.as_i64()).single()
      .ok_or_else(|| anyhow::anyhow!("Invalid creation date for event {}", event.id))?;

    let db_event_result = self.insert(InsertDbEvent{
      id: event.id.to_string(),
      payload: serde_json::to_string(&event)?,
      created_at: created_at,
      kind: event.kind.as_u32() as i32,
      pubkey_id: db_pubkey.attrs.id.clone(),
    }).save().await;

    let db_event = match db_event_result {
      Ok(event) => event,
      Err(error) => {
        if let Some(db_error) = error.as_database_error() {
          if db_error.code().map(|c| &c == "23505").unwrap_or(false) { // Uniqueness validation error.
            let existing = self.find(&event.id.to_string()).await?;
            return Ok((existing, other_event_ids));
          }
        }
        return Err(error)?;
      }
    };

    db_pubkey.register_source(&db_event).await?;

    self.state.db_event_source().insert(InsertDbEventSource{
      event_id: db_event.attrs.id.clone(),
      relay_id: relay_id.to_string(),
    }).save().await?;

    if event.kind == Kind::RecommendRelay {
      self.state.db_relay().add(&event.id, &UncheckedUrl::new(event.content.clone())).await?;
    }

    for tag in &event.tags {
      match tag {
        Tag::Event(other_event_id, maybe_relay_url, _) => {
          if self.state.db_event().find_optional(&other_event_id.to_string()).await?.is_none() {
            other_event_ids.push(other_event_id.clone());
          }

          if let Some(url) = maybe_relay_url {
            self.state.db_relay().add(&event.id, url).await?;
          }
        },
        Tag::PubKey(pubkey, maybe_relay_url) => {
          self.state.db_pubkey().add(&event.id, pubkey).await?;

          if let Some(url) = maybe_relay_url {
            self.state.db_relay().add(&event.id, url).await?;
          }
        },
        Tag::RelayMetadata(url, _) => {
          self.state.db_relay().add(&event.id, url).await?;
        },
        Tag::A { public_key, relay_url, .. } => {
          self.state.db_pubkey().add(&event.id, public_key).await?;

          if let Some(url) = relay_url {
            self.state.db_relay().add(&event.id, url).await?;
          }
        },
        Tag::Relay(url) => {
          self.state.db_relay().add(&event.id, url).await?;
        },
        Tag::ContactList { pk, relay_url, ..} => {
          self.state.db_pubkey().add(&event.id, pk).await?;

          if let Some(url) = relay_url {
            self.state.db_relay().add(&event.id, url).await?;
          }
        },
        Tag::Delegation { delegator_pk, .. } => {
          self.state.db_pubkey().add(&event.id, delegator_pk).await?;
        },
        Tag::Relays(urls) => {
          for url in urls {
            self.state.db_relay().add(&event.id, url).await?;
          }
        },
        _ => (),
      }
    }

    Ok((db_event, other_event_ids))
  }
}

model!{
  state: Site,
  table: relays,
  struct DbRelay {
    #[sqlx_model_hints(varchar)]
    id: String,
    #[sqlx_model_hints(timestamptz, default)]
    first_found_at: UtcDateTime,
    #[sqlx_model_hints(timestamptz, default)]
    banned_until: Option<UtcDateTime>,
    #[sqlx_model_hints(boolean, default)]
    banned_forever: bool,
  },
  queries {
    relays_found_after("NOT banned_forever AND first_found_at > $1", d: UtcDateTime)
  },
  has_many{
    DbRelaySource(relay_id), // All the events that mentioned this relay.
    DbEventSource(relay_id), // All the events found on this relay.
    DbRelayLogEntry(relay_id),
  }
}

impl DbRelayHub {
  pub async fn create_if_missing(&self, id: String) -> sqlx::Result<DbRelay> {
    self.state.db.execute(sqlx::query!("INSERT INTO relays (id) VALUES ($1) ON CONFLICT DO NOTHING", id)).await?;
    self.find(&id).await
  }

  pub async fn add(&self, event_id: &EventId, unchecked_url: &UncheckedUrl) -> anyhow::Result<()> {
    if unchecked_url.to_string() == "" {
      return Ok(())
    }

    let url = Url::try_from(unchecked_url.clone())
      .with_context(|| format!("Failed adding relay {unchecked_url:?}"))?
      .to_string();

    let db_relay = self.create_if_missing(url).await?;

    self.state.db_relay_source().insert(InsertDbRelaySource{
      relay_id: db_relay.attrs.id.clone(),
      event_id: event_id.to_string(),
    }).save().await?;

    Ok(())
  }
}

impl DbRelay {
  pub async fn run(&self) -> ProcessingResult<()> {
    loop {
      if self.reloaded().await?.is_temporarily_banned() {
        self.log("waiting_until_unbanned", self.banned_until().as_ref()).await?;
        while self.reloaded().await?.is_temporarily_banned() {
          sleep(Duration::from_secs(20)).await;
        }
      }

      let relay_id = self.id().clone();
      let result = self.process_events().await;

      if let Err(e) = &result {
        let (text, json) = e.text_and_json();
        if let Err(oops) = self.log_err(text, Some(json)).await {
          println!("{relay_id}: Oops, could not log error because of {oops:?}");
        }

        match e {
          EventProcessingError::Database(_) => return result,
          EventProcessingError::RelayConnect(_) => {
            self.clone().ban_forever().await?;
            return Ok(());
          },
          _ => {}
        }
      }

      let errors: Vec<DbRelayLogEntry> = self.state.db_relay_log_entry()
        .extract_for( self.attrs.id.clone(), Utc::now() - chrono::Duration::minutes(30) )
        .all().await?
        .into_iter()
        .filter(|e| e.summary().starts_with("tungstenite_") )
        .collect();

      if errors.len() > 15 {
        self.log("banning forever","").await?;
        self.clone().ban_forever().await?;
        return Ok(())
      } else if errors.len() > 3 {
        self.log("banning temporarily","").await?;
        self.clone().update().banned_until(Some(Utc::now() + chrono::Duration::minutes(30))).save().await?;
      }
    }
  }

  async fn process_events(&self) -> ProcessingResult<()> {
    let (mut socket, _) = connect_async(self.id()).await
      .map_err(|e| EventProcessingError::RelayConnect(format!("{:?}", e)) )?;

    self.log("connected", "").await?;

    let main_subscription = SubscriptionId::new("main_subscription");
    self.suscribe(&mut socket, main_subscription.clone(), Filter::new().limit(1000)).await?;

    let mut pubkeys_offset = 1;

    self.subscribe_to_pubkeys(&mut socket, pubkeys_offset).await?;

    while let Some(raw_msg) = socket.next().await {
      let msg = raw_msg?;
      let msg_text = msg.to_text()?;

      match RelayMessage::from_json(msg_text) {
        Ok(handled_message) => match handled_message {
          RelayMessage::Event { event, .. } => {
            event.verify()?;
            let (_, other_event_ids) = self.state.db_event()
              .add(*event, self.id()).await?;
            if !other_event_ids.is_empty() {
              self.suscribe(
                &mut socket,
                SubscriptionId::generate(),
                Filter::new().events(other_event_ids)
              ).await?;
            }
          },
          RelayMessage::EndOfStoredEvents(subscription_id) => {
            if subscription_id != main_subscription {
              self.log("closing_subscription", Some(&subscription_id)).await?;
              socket
                .send(WsMessage::Text(ClientMessage::close(subscription_id).as_json()))
                .await?;
            }
            pubkeys_offset += 1;
            self.subscribe_to_pubkeys(&mut socket, pubkeys_offset).await?;
          },
          RelayMessage::Notice{ message } => { self.log("notice", message).await?; },
          RelayMessage::Ok { event_id, status, message } => { self.log("ok", (event_id, status, message)).await?; },
          other => { self.log("other_message", other).await?; },
        },
        Err(e) => {
          self.log("unparseable_message", e.to_string()).await?;
        }
      }
    }

    Ok(())
  }

  async fn subscribe_to_pubkeys(&self, socket: &mut Wss, offset: i64) -> anyhow::Result<()> {
    let per_page = 50;

    let pubkeys = self.state.db_pubkey().select()
      .order_by(DbPubkeyOrderBy::FirstFoundAt)
      .limit(per_page)
      .offset(offset * per_page)
      .all().await?
      .into_iter().map(|p| XOnlyPublicKey::from_str(&p.attrs.id)  )
      .collect::<Result<Vec<XOnlyPublicKey>, _>>()?;

    if !pubkeys.is_empty() {
      self.log("suscribing_for_pubkey_catch_up", offset).await?;
      self.suscribe(
        socket,
        SubscriptionId::new(&format!("pubkeys_group_{offset}")),
        Filter::new().pubkeys(pubkeys)
      ).await?;
    }

    return Ok(());
  }

  async fn suscribe(&self, socket: &mut Wss, id: SubscriptionId, filter: Filter) -> anyhow::Result<()> {
    Ok(socket.send(WsMessage::Text( ClientMessage::new_req(id, vec![filter]).as_json() )).await?)
  }

  async fn log<S: Serialize>(&self, text: &str, json: S) -> anyhow::Result<DbRelayLogEntry> {
    self.state.db_relay_log_entry().log(Severity::Debug, self.id(), text, Some(json)).await
  }

  async fn log_err<S: Serialize>(&self, text: &str, json: S) -> anyhow::Result<DbRelayLogEntry> {
    self.state.db_relay_log_entry().log(Severity::Error, self.id(), text, Some(json)).await
  }

  fn is_temporarily_banned(&self) -> bool {
    self.banned_until().map(|date| date > Utc::now() ).unwrap_or(false)
  }

  async fn ban_forever(self) -> sqlx::Result<Self> {
    self.update().banned_forever(true).save().await
  }
}

// Tells that 'event' mentioned 'pubkey'.
model!{
  state: Site,
  table: pubkey_sources,
  struct DbPubkeySource {
    #[sqlx_model_hints(int4, default)]
    id: i32,
    #[sqlx_model_hints(varchar)]
    event_id: String,
    #[sqlx_model_hints(varchar)]
    pubkey_id: String,
    #[sqlx_model_hints(timestamptz, default)]
    created_at: UtcDateTime,
  },
  belongs_to{
    DbEvent(event_id),
    DbPubkey(pubkey_id),
  }
}

// Tells that 'event' mentioned 'relay'.
model!{
  state: Site,
  table: relay_sources,
  struct DbRelaySource {
    #[sqlx_model_hints(int4, default)]
    id: i32,
    #[sqlx_model_hints(varchar)]
    relay_id: String,
    #[sqlx_model_hints(varchar)]
    event_id: String,
    #[sqlx_model_hints(timestamptz, default)]
    created_at: UtcDateTime,
  },
  belongs_to{
    DbRelay(relay_id),
    DbEvent(event_id),
  }
}

// Tells that 'relay' provided 'event'.
model!{
  state: Site,
  table: event_sources,
  struct DbEventSource {
    #[sqlx_model_hints(int4, default)]
    id: i32,
    #[sqlx_model_hints(varchar)]
    event_id: String,
    #[sqlx_model_hints(varchar)]
    relay_id: String,
    #[sqlx_model_hints(timestamptz, default)]
    created_at: UtcDateTime,
  },
  belongs_to{
    DbEvent(event_id),
    DbRelay(relay_id),
  }
}

// Log entries with relay activity, connection, disconnection, etc.
model!{
  state: Site,
  table: relay_log_entries,
  struct DbRelayLogEntry {
    #[sqlx_model_hints(int4, default)]
    id: i32,
    #[sqlx_model_hints(timestamptz, default)]
    created_at: UtcDateTime,
    #[sqlx_model_hints(varchar)]
    relay_id: String,
    #[sqlx_model_hints(severity)]
    severity: Severity,
    #[sqlx_model_hints(varchar)]
    summary: String,
    #[sqlx_model_hints(text)]
    json: String,
  },
  queries {
    extract_for("relay_id = $1 AND created_at > $2", relay_id: String, since: UtcDateTime)
  },
  belongs_to{
    DbRelay(relay_id),
  }
}

impl DbRelayLogEntryHub {
  pub async fn log<S: Serialize>(&self, severity: Severity, relay_id: &str, summary: &str, json: Option<S>) -> anyhow::Result<DbRelayLogEntry> {
    Ok(
      self.insert(InsertDbRelayLogEntry{
        severity,
        relay_id: relay_id.to_string(),
        summary: summary.to_string(),
        json: serde_json::to_string(&json)?
      }).save().await?
    )
  }
}

#[derive(sqlx::Type, Copy, Clone, Debug, Deserialize, PartialEq, Serialize)]
#[sqlx(type_name = "severity", rename_all = "lowercase")]
pub enum Severity {
  Trace,
  Debug,
  Info,
  Warning,
  Error,
}

impl sqlx::postgres::PgHasArrayType for Severity {
  fn array_type_info() -> sqlx::postgres::PgTypeInfo {
    sqlx::postgres::PgTypeInfo::with_name("_severity")
  }
}

