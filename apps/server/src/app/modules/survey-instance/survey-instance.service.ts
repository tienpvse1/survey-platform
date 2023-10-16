import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { sql } from 'kysely';
import { InjectRepository, Repository } from '../database/database.module';
import { CreateSurveyInstanceInput } from './dto/create-survey-instance.input';

@Injectable()
export class SurveyInstanceService {
  constructor(@InjectRepository() private readonly repository: Repository) {}

  async createSurvey({
    participantInformation,
    surveyId,
  }: CreateSurveyInstanceInput) {
    const [createdSurveyInstance, err] = await this.repository
      .insertInto('surveyInstance')
      .values({
        surveyId: surveyId,
        status: 'viewed',
        participantInformation: sql`${JSON.stringify(
          participantInformation
        )}::jsonb`,
      })
      .returningAll()
      .executeTakeFirst()
      .try();
    if (err) throw new InternalServerErrorException(err.message);
    return createdSurveyInstance;
  }

  async startSurvey(surveyInstanceId: string) {
    const [result, err] = await this.repository
      .updateTable('surveyInstance')
      .set({ status: 'started' })
      .where('id', '=', surveyInstanceId)
      .returningAll()
      .executeTakeFirstOrThrow()
      .try();
    if (err) throw new InternalServerErrorException(err.message);
    return result;
  }

  async dropOff(surveyInstanceId: string) {
    const [result, err] = await this.repository
      .updateTable('surveyInstance')
      .set({ status: 'drop-off' })
      .where('id', '=', surveyInstanceId)
      .returningAll()
      .executeTakeFirstOrThrow()
      .try();
    if (err) throw new InternalServerErrorException(err.message);
    return result;
  }
}
