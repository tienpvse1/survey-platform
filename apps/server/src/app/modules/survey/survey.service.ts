import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QueryCreator } from 'kysely';
import { DB } from 'kysely-codegen';
import { InjectRepository, Repository } from '../database/database.module';
import { CreateSurveyInput } from './dto/create-survey.input';

@Injectable()
export class SurveyService {
  constructor(@InjectRepository() private readonly repository: Repository) {}
  async createSurveyWithQuestions({
    questions,
    ...surveyInfo
  }: CreateSurveyInput) {
    const [survey, err] = await this.repository
      // CTEs
      .with('createdSurvey', this.createSurveyExpression(surveyInfo))
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

  private createSurveyExpression(value: Omit<CreateSurveyInput, 'questions'>) {
    return (eb: QueryCreator<DB>) =>
      eb.insertInto('survey').values(value).returningAll();
  }

  private createQuestionExpression(value: CreateSurveyInput['questions']) {
    return (eb: QueryCreator<DB>) =>
      eb.insertInto('question').values(value).returningAll();
  }
}
