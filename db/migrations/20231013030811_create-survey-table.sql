-- migrate:up
CREATE TYPE survey_status AS ENUM(
  'viewed',
  'started',
  'done',
  'drop-off'
);

CREATE TABLE IF NOT EXISTS public."survey"(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT 'now()',
  updated_at timestamp with time zone,
  "name" text NOT NULL DEFAULT '',
  "description" text
);

CREATE TABLE IF NOT EXISTS public."survey_instance"(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent jsonb DEFAULT '{}' ::jsonb,
  survey_id uuid NOT NULL,
  "status" survey_status DEFAULT 'viewed',
  CONSTRAINT survey_fk FOREIGN KEY (survey_id) REFERENCES survey(id)
);

CREATE TABLE IF NOT EXISTS public."survey_question"(
  survey_id uuid,
  question_id uuid,
  CONSTRAINT survey_fk FOREIGN KEY (survey_id) REFERENCES survey(id),
  CONSTRAINT question_fk FOREIGN KEY (question_id) REFERENCES question(id),
  PRIMARY KEY (survey_id, question_id)
);

CREATE TABLE IF NOT EXISTS public."answer"(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT 'now()',
  updated_at timestamp with time zone,
  "value" jsonb,
  question_id uuid NOT NULL,
  survey_instance_id uuid NOT NULL,
  CONSTRAINT survey_instance_fk FOREIGN KEY (survey_instance_id) REFERENCES survey_instance(id),
  CONSTRAINT question_fk FOREIGN KEY (question_id) REFERENCES question(id)
);

CREATE TRIGGER assign_survey_update_date
  BEFORE UPDATE ON public."survey"
  FOR EACH ROW
  EXECUTE PROCEDURE assign_update_date();

CREATE TRIGGER assign_answer_update_date
  BEFORE UPDATE ON public."answer"
  FOR EACH ROW
  EXECUTE PROCEDURE assign_update_date();

-- migrate:down
DROP TRIGGER assign_answer_update_date ON public."answer";

DROP TRIGGER assign_survey_update_date ON public."survey";

DROP TABLE IF EXISTS public."answer";

DROP TABLE IF EXISTS public."survey_question";

DROP TABLE IF EXISTS public."survey_instance";

DROP TABLE IF EXISTS public."survey";

DROP TYPE public."survey_status";

