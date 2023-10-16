-- migrate:up
ALTER TABLE public."survey_instance" RENAME COLUMN agent TO participant_information;

-- migrate:down
ALTER TABLE public."survey_instance" RENAME COLUMN participant_information TO agent;

