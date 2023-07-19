use tokio::{ task::spawn, time::{sleep, Duration}};
use sqlx::types::chrono::{Utc, TimeZone};

mod models;
use models::*;

#[tokio::main]
async fn main() {
  dotenv::dotenv().expect("dotenv to load");
  env_logger::init();

  loop {
    let result = spawn_relay_workers().await;
    println!("Relay watcher got result {result:?}. Retrying in 60 seconds...");
    sleep(Duration::from_secs(60)).await;
  }
}

async fn spawn_relay_workers() -> anyhow::Result<()> {
  let site = Site::new().await?;

  site.db_relay().create_if_missing("wss://nos.lol/".to_string()).await?;

  let mut newest_relay_date = Utc.timestamp_opt(0,0).earliest()
    .expect("The literal 0,0 timestamp is always ok");

  loop {
    let newer_relays = site.db_relay().relays_found_after(newest_relay_date).all().await?;
    newest_relay_date = newer_relays.last()
      .map(|p| p.first_found_at().clone() )
      .unwrap_or(newest_relay_date);

    for relay in newer_relays.into_iter() {
      spawn(async move {
        loop {
          if relay.run().await.is_ok() { break; }
        }
      });
    }

    print!("\rTime: {}", Utc::now());
  }
}
