import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { JSONType } from '../../../scalars';
export enum SurveyStatus {
  VIEWED = 'viewed',
  STARTED = 'started',
  DONE = 'done',
  DROP_OFF = 'drop-off',
}
export enum QuestionTemplateType {
  DATE = 'date',
  DATE_TIME = 'datetime',
  DYNAMIC_TABLE = 'dynamic-table',
  MULTI_SELECT = 'multi-select',
  NUMBER = 'number',
  SINGLE_SELECT = 'single-select',
  TEXT = 'text',
}
registerEnumType(SurveyStatus, { name: 'SurveyStatus' });
registerEnumType(QuestionTemplateType, { name: 'QuestionTemplateType' });

@InputType('CreateQuestionInput')
class CreateQuestionInput {
  @Field(() => String)
  title: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => JSONType, { nullable: true })
  config: unknown;
  @Field(() => QuestionTemplateType, {
    defaultValue: QuestionTemplateType.TEXT,
  })
  questionTemplateType: QuestionTemplateType;
}

@InputType('CreateSurveyInput')
export class CreateSurveyInput {
  @Field(() => String)
  name: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => [CreateQuestionInput])
  questions: CreateQuestionInput[];
}
