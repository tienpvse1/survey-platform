import { Field, ObjectType } from '@nestjs/graphql';
import { JSONType, UUID } from '../../../scalars';
import { SurveyStatus } from '../../survey/dto/create-survey.input';

@ObjectType('SurveyInstance')
export class SurveyInstance {
  @Field(() => UUID)
  id: string;
  @Field(() => SurveyStatus)
  status: SurveyStatus;
  @Field(() => UUID)
  surveyId: string;
  @Field(() => JSONType, { nullable: true })
  agent: unknown;
}
