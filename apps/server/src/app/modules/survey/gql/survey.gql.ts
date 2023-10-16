import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('SurveyEntity')
export class SurveyEntity {
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
}

@ObjectType('CreatedSurvey')
export class CreatedSurvey {
  @Field(() => String)
  surveyId: string;
}
