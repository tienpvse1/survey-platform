import { Field, InputType } from '@nestjs/graphql';
import { Email, JSONType } from '../../../scalars';

@InputType('RegisterInput')
export class RegisterInput {
  @Field(() => Email)
  email: string;
  @Field()
  name: string;
  @Field()
  password: string;
  @Field(() => JSONType, { nullable: true })
  customData: unknown;
}
