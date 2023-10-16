import { Module } from '@nestjs/common';
import { SurveyInstanceService } from './survey-instance.service';
import { SurveyInstanceResolver } from './survey-instance.resolver';

@Module({
  providers: [SurveyInstanceResolver, SurveyInstanceService],
})
export class SurveyInstanceModule {}
