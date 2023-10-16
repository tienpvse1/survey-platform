import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'process';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy],
  imports: [
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: {
        algorithm: 'HS256',
        issuer: 'survey.tienpvse.com',
        expiresIn: env.ACCESS_TOKEN_EXPIRATION,
      },
      verifyOptions: {
        algorithms: ['HS256'],
        issuer: 'survey.tienpvse.com',
      },
    }),
  ],
})
export class AuthModule {}
