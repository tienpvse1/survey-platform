import { Field, InputType } from '@nestjs/graphql';
import { JSONType, UUID } from '../../../scalars';

@InputType('CreateAnswerInput')
export class CreateAnswerInput {
  @Field(() => JSONType, { defaultValue: '' })
  value: unknown;
  @Field(() => UUID)
  questionId: string;
  @Field(() => UUID)
  surveyInstanceId: string;
}
