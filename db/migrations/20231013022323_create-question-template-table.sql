-- migrate:up
CREATE TYPE question_template_type AS ENUM(
  'text',
  'rating',
  'number',
  'single-select',
  'multi-select',
  'dynamic-table',
  'date',
  'datetime'
);

-- migrate:down
DROP TYPE question_template_type;

