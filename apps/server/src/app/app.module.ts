import { Module } from '@nestjs/common';

import { YogaDriver, YogaDriverConfig } from '@graphql-yoga/nestjs';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { env } from 'process';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnswerModule } from './modules/answer/answer.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt.guard';
import { DatabaseModule } from './modules/database/database.module';
import { QuestionModule } from './modules/question/question.module';
import { SurveyInstanceModule } from './modules/survey-instance/survey-instance.module';
import { SurveyModule } from './modules/survey/survey.module';
import { UserModule } from './modules/user/user.module';
import { Email, JSONType } from './scalars';

@Module({
  imports: [
    GraphQLModule.forRoot<YogaDriverConfig>({
      autoSchemaFile: true,
      driver: YogaDriver,
      resolvers: { Email, JSONType },
    }),
    DatabaseModule.forRoot({
      database: env.POSTGRES_DB,
      host: env.POSTGRES_HOST,
      pass: env.POSTGRES_PASSWORD,
      port: env.POSTGRES_PORT,
      user: 'postgres',
    }),
    UserModule,
    AuthModule,
    QuestionModule,
    AnswerModule,
    SurveyModule,
    SurveyInstanceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
