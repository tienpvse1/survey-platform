import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../../decorators';
import { IsPublic } from '../../decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthenticatedUser } from './entities/auth.entity';
import { LoginResponse } from './entities/logged-in.gql';

@Resolver(() => AuthenticatedUser)
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Mutation(() => String)
  toJsonString() {
    return 'placeholder to define Object.prototype.toJsonString method';
  }

  @Query(() => String)
  toJsonStringQuery() {
    return 'placeholder to define Object.prototype.toJsonString method';
  }

  @IsPublic()
  @Mutation(() => LoginResponse)
  login(@Args('input') input: LoginInput) {
    return this.service.login(input.email, input.password);
  }

  @IsPublic()
  @Mutation(() => AuthenticatedUser)
  register(@Args('input') input: RegisterInput) {
    return this.service.register(input);
  }

  @Query(() => AuthenticatedUser)
  me(@User('id') id: string) {
    return this.service.findUserById(id);
  }
}
