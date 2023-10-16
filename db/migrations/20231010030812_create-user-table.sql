-- migrate:up
DROP SCHEMA IF EXISTS tiger CASCADE;

DROP SCHEMA IF EXISTS topology CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE EXTENSION IF NOT EXISTS "plv8";

CREATE OR REPLACE FUNCTION public."assign_update_date"()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = 'now()';
  RETURN NEW;
END
$$
LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS public."user"(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT 'now()',
  updated_at timestamp with time zone,
  name text,
  email text NOT NULL UNIQUE,
  password text NOT NULL,
  custom_data jsonb DEFAULT jsonb_build_object()
);

CREATE TRIGGER assign_user_update_date
  BEFORE UPDATE ON public."user"
  FOR EACH ROW
  EXECUTE PROCEDURE assign_update_date();

-- migrate:down
DROP TRIGGER assign_user_update_date ON public."user";

DROP TABLE IF EXISTS public."user";

DROP FUNCTION IF EXISTS public."assign_update_date";

DROP EXTENSION IF EXISTS "plv8";

DROP EXTENSION IF EXISTS "uuid-ossp";

