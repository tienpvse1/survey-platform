import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { UUID } from '../../../scalars';

@ObjectType('Survey')
export class Survey {
  @Field(() => ID)
  id: string;
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;
  @Field(() => String)
  name: string;
  @Field(() => String, { nullable: true })
  description: string;
  @Field(() => UUID)
  createdById: string;
}

@ObjectType('CreatedSurvey')
export class CreatedSurvey {
  @Field(() => String)
  surveyId: string;
}
