import { Field, ObjectType } from '@nestjs/graphql';
import { AuthenticatedUser } from './auth.entity';

@ObjectType('LoginResponse')
export class LoginResponse {
  @Field(() => String)
  accessToken: string;
  @Field(() => String)
  refreshToken: string;
  @Field(() => AuthenticatedUser)
  user: AuthenticatedUser;
}
