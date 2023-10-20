import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Email, JSONType, UUID } from '../../../scalars';

@ObjectType()
export class User {
  @Field(() => UUID)
  id: string;
  @Field(() => GraphQLISODateTime)
  createdAt: Date | string;
  @Field(() => GraphQLISODateTime)
  updatedAt: Date | string;
  @Field()
  name: string;
  @Field(() => Email)
  email: string;
  @Field(() => JSONType)
  customData: unknown;
}
