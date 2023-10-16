SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: tiger_data; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA tiger_data;


--
-- Name: plv8; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plv8 WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plv8; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plv8 IS 'PL/JavaScript (v8) trusted procedural language';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: question_template_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.question_template_type AS ENUM (
    'text',
    'rating',
    'number',
    'single-select',
    'multi-select',
    'dynamic-table',
    'date',
    'datetime'
);


--
-- Name: survey_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.survey_status AS ENUM (
    'viewed',
    'started',
    'done',
    'drop-off'
);


--
-- Name: assign_update_date(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.assign_update_date() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = 'now()';
  RETURN NEW;
END
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: answer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.answer (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT '2023-10-16 03:11:48.120541+00'::timestamp with time zone,
    updated_at timestamp with time zone,
    value jsonb,
    question_id uuid NOT NULL,
    survey_instance_id uuid NOT NULL
);


--
-- Name: question; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.question (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT '2023-10-13 07:05:19.594466+00'::timestamp with time zone,
    updated_at timestamp with time zone,
    title text DEFAULT ''::text NOT NULL,
    description text DEFAULT ''::text,
    config jsonb,
    question_template_type public.question_template_type DEFAULT 'text'::public.question_template_type,
    survey_id uuid
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: survey; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.survey (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT '2023-10-16 03:11:48.120541+00'::timestamp with time zone,
    updated_at timestamp with time zone,
    name text DEFAULT ''::text NOT NULL,
    description text
);


--
-- Name: survey_instance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.survey_instance (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    survey_id uuid NOT NULL,
    status public.survey_status DEFAULT 'viewed'::public.survey_status,
    participant_information jsonb DEFAULT '{}'::jsonb
);


--
-- Name: survey_question; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.survey_question (
    survey_id uuid NOT NULL,
    question_id uuid NOT NULL
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT '2023-10-13 06:59:41.35845+00'::timestamp with time zone,
    updated_at timestamp with time zone,
    name text,
    email text NOT NULL,
    password text NOT NULL,
    custom_data jsonb DEFAULT jsonb_build_object()
);


--
-- Name: answer answer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT answer_pkey PRIMARY KEY (id);


--
-- Name: question question_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.question
    ADD CONSTRAINT question_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: survey_instance survey_instance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.survey_instance
    ADD CONSTRAINT survey_instance_pkey PRIMARY KEY (id);


--
-- Name: survey survey_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.survey
    ADD CONSTRAINT survey_pkey PRIMARY KEY (id);


--
-- Name: survey_question survey_question_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.survey_question
    ADD CONSTRAINT survey_question_pkey PRIMARY KEY (survey_id, question_id);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: answer assign_answer_update_date; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER assign_answer_update_date BEFORE UPDATE ON public.answer FOR EACH ROW EXECUTE FUNCTION public.assign_update_date();


--
-- Name: question assign_question_update_date; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER assign_question_update_date BEFORE UPDATE ON public.question FOR EACH ROW EXECUTE FUNCTION public.assign_update_date();


--
-- Name: survey assign_survey_update_date; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER assign_survey_update_date BEFORE UPDATE ON public.survey FOR EACH ROW EXECUTE FUNCTION public.assign_update_date();


--
-- Name: user assign_user_update_date; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER assign_user_update_date BEFORE UPDATE ON public."user" FOR EACH ROW EXECUTE FUNCTION public.assign_update_date();


--
-- Name: survey_question question_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.survey_question
    ADD CONSTRAINT question_fk FOREIGN KEY (question_id) REFERENCES public.question(id);


--
-- Name: answer question_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT question_fk FOREIGN KEY (question_id) REFERENCES public.question(id);


--
-- Name: survey_instance survey_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.survey_instance
    ADD CONSTRAINT survey_fk FOREIGN KEY (survey_id) REFERENCES public.survey(id);


--
-- Name: survey_question survey_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.survey_question
    ADD CONSTRAINT survey_fk FOREIGN KEY (survey_id) REFERENCES public.survey(id);


--
-- Name: answer survey_instance_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.answer
    ADD CONSTRAINT survey_instance_fk FOREIGN KEY (survey_instance_id) REFERENCES public.survey_instance(id);


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20231010030812'),
    ('20231013022323'),
    ('20231013024851'),
    ('20231013030811'),
    ('20231016040402');
