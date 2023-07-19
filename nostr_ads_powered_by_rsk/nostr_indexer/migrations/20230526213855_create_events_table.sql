-- The initial schema is limited to mapping the nostr network, storing all events and discovering relays and pubkeys.
-- Other aspects, like follower/following count must be tracked in their own tables built from reading from events.
-- These tables should be considered "read-only" for any other uses.

CREATE TABLE pubkeys (
  id VARCHAR PRIMARY KEY NOT NULL,
  first_found_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX pubkeys_first_found_at ON pubkeys (first_found_at);

CREATE TABLE events (
  id VARCHAR PRIMARY KEY NOT NULL,
  payload TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  pubkey_id VARCHAR NOT NULL REFERENCES pubkeys(id)
);
CREATE INDEX events_pubkey_id ON events (pubkey_id);

CREATE TABLE relays (
  id VARCHAR PRIMARY KEY NOT NULL,
  banned_until TIMESTAMPTZ,
  first_found_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX relays_first_found_at ON relays (first_found_at);

-- We track which events mentioned a specific pubkey just for metrics and auditing.
-- It will help us track down pubkeys that get mentioned but have no events of their own.
-- Seeded pubkeys may not appear on this table until we get an event mentioning them.
CREATE TABLE pubkey_sources (
  id SERIAL PRIMARY KEY NOT NULL,
  event_id VARCHAR NOT NULL REFERENCES events(id),
  pubkey_id VARCHAR NOT NULL REFERENCES pubkeys(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX pubkey_sources_pubkey_id ON pubkey_sources (pubkey_id);
CREATE INDEX pubkey_sources_event_id ON pubkey_sources (event_id);

-- We want to know what events mentioned a relay to help us audit problems connecting to them.
-- Seeded relays may have no sources if they have no events or an error occurs fetching events from them.
CREATE TABLE relay_sources (
  id SERIAL PRIMARY KEY NOT NULL,
  relay_id VARCHAR NOT NULL REFERENCES relays(id),
  event_id VARCHAR NOT NULL REFERENCES events(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX relay_sources_relay_id ON relay_sources (relay_id);
CREATE INDEX relay_sources_event_id ON relay_sources (event_id);

-- We may get the same event from different relays, this is how we track it.
CREATE TABLE event_sources (
  id SERIAL PRIMARY KEY NOT NULL,
  event_id VARCHAR NOT NULL REFERENCES events(id),
  relay_id VARCHAR NOT NULL REFERENCES relays(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX event_sources_event_id ON event_sources (event_id);
CREATE INDEX event_sources_relay_id ON event_sources (relay_id);

-- We keep logs for every relay to improve our indexing.
CREATE TYPE severity AS ENUM (
  'trace',
  'debug',
  'info',
  'warning',
  'error'
);
CREATE TABLE relay_log_entries (
  id SERIAL PRIMARY KEY NOT NULL,
  relay_id VARCHAR NOT NULL REFERENCES relays(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  severity severity NOT NULL,
  summary VARCHAR NOT NULL,
  json TEXT
);
