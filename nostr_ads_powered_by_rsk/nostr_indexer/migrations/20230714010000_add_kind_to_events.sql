CREATE OR REPLACE FUNCTION extract_kind(input_text TEXT) RETURNS integer AS $$
  BEGIN
    BEGIN
      RETURN input_text::json->'kind';
    EXCEPTION WHEN others THEN
      RETURN substring(input_text from '"kind":\b*(\d)')::integer;
    END;
  END;
$$ LANGUAGE plpgsql IMMUTABLE;

ALTER TABLE events ADD COLUMN kind INTEGER;
UPDATE events SET kind = extract_kind(payload);
ALTER TABLE events ALTER COLUMN kind SET NOT NULL;
CREATE INDEX events_kind ON events (kind);
