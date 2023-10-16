import { Field, InputType } from '@nestjs/graphql';
import { Email } from '../../../scalars';

@InputType('LoginInput')
export class LoginInput {
  @Field(() => Email)
  email: string;
  @Field(() => String)
  password: string;
}
