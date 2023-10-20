-- migrate:up
ALTER TABLE public."survey"
  ADD COLUMN created_by_id uuid NOT NULL;

ALTER TABLE public."survey"
  ADD CONSTRAINT creator_fk FOREIGN KEY (created_by_id) REFERENCES public."user"(id);

-- migrate:down
ALTER TABLE public."survey"
  DROP CONSTRAINT creator_fk;

ALTER TABLE public."survey"
  DROP COLUMN created_by_id;

