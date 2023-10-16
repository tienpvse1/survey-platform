-- migrate:up
CREATE TABLE IF NOT EXISTS public."question"(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT 'now()',
  updated_at timestamp with time zone,
  title text NOT NULL DEFAULT '',
  "description" text DEFAULT '',
  config jsonb,
  question_template_type question_template_type DEFAULT 'text',
  survey_id uuid
);

CREATE TRIGGER assign_question_update_date
  BEFORE UPDATE ON public."question"
  FOR EACH ROW
  EXECUTE PROCEDURE assign_update_date();

-- migrate:down
DROP TRIGGER assign_question_update_date ON public."question";

DROP TABLE IF EXISTS public."question";

