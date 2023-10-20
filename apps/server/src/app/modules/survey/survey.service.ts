import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QueryCreator } from 'kysely';
import { DB } from 'kysely-codegen';
import {
  DatabaseModule,
  InjectRepository,
  Repository,
} from '../database/database.module';
import { CreateSurveyInput } from './dto/create-survey.input';

@Injectable()
export class SurveyService {
  constructor(@InjectRepository() private readonly repository: Repository) {}

  async loadUsers(userIds: readonly string[]) {
    const [users, err] = await DatabaseModule.DbInstance.selectFrom('user')
      .where('id', 'in', userIds)
      .selectAll()
      .execute()
      .try();
    if (err) return [];
    return userIds.map((id) => users.filter((user) => user.id === id)[0]);
  }

  async createSurveyWithQuestions(
    { questions, ...surveyInfo }: CreateSurveyInput,
    userId: string
  ) {
    const [survey, err] = await this.repository
      // CTEs
      .with('createdSurvey', this.createSurveyExpression(surveyInfo, userId))
      .with('createdQuestion', this.createQuestionExpression(questions))
      .with('insertValue', (eb) =>
        eb
          .selectFrom('createdSurvey')
          .leftJoin('createdQuestion', (join) => join.onTrue())
          .select([
            'createdQuestion.id as questionId',
            'createdSurvey.id as surveyId',
          ])
      )
      // insert statement
      .insertInto('surveyQuestion')
      .columns(['questionId', 'surveyId'])
      .expression((eb) =>
        eb.selectFrom('insertValue').select(['questionId', 'surveyId'])
      )
      // returning part
      .returning('surveyId')
      .executeTakeFirst()
      .try();
    if (err) throw new InternalServerErrorException(err.message);
    return survey;
  }

  async getOwnSurveys(userId: string) {
    const [surveys, err] = await this.repository
      .selectFrom('survey')
      .where('createdById', '=', userId)
      .selectAll()
      .execute()
      .try();
    if (err) throw new InternalServerErrorException(err.message);
    return surveys;
  }
  private createSurveyExpression(
    value: Omit<CreateSurveyInput, 'questions'>,
    userId: string
  ) {
    return (eb: QueryCreator<DB>) =>
      eb
        .insertInto('survey')
        .values({ ...value, createdById: userId })
        .returningAll();
  }

  private createQuestionExpression(value: CreateSurveyInput['questions']) {
    return (eb: QueryCreator<DB>) =>
      eb.insertInto('question').values(value).returningAll();
  }
}
