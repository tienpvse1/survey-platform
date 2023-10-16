import { Field, InputType } from '@nestjs/graphql';
import { JSONType, UUID } from '../../../scalars';

@InputType('CreateSurveyInstanceInput')
export class CreateSurveyInstanceInput {
  @Field(() => UUID)
  surveyId: string;
  @Field(() => JSONType, { nullable: true })
  participantInformation: string;
}
