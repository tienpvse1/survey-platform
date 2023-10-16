import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { JSONType, UUID } from '../../../scalars';

@ObjectType()
export class Answer {
  @Field(() => UUID)
  id: string;
  @Field(() => GraphQLISODateTime)
  createdAt: string;
  @Field(() => GraphQLISODateTime)
  updatedAt: string;
  @Field(() => JSONType)
  value: string;
  @Field(() => UUID)
  questionId: string;
  @Field(() => UUID)
  surveyInstanceId: string;
}
