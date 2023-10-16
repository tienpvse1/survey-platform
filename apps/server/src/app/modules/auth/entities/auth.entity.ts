import { Field, ObjectType } from '@nestjs/graphql';
import { Email, JSONType } from '../../../scalars';

@ObjectType()
export class AuthenticatedUser {
  @Field(() => Email)
  email: string;
  @Field()
  name: string;
  @Field(() => JSONType, { nullable: true })
  customData: unknown;
}
