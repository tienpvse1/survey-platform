import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository, Repository } from '../database/database.module';
import { CreateAnswerInput } from './dto/create-answer.input';

@Injectable()
export class AnswerService {
  constructor(@InjectRepository() private readonly repository: Repository) {}

  async createAnswer(input: CreateAnswerInput[]) {
    const [answers, err] = await this.repository
      .insertInto('answer')
      .values(input)
      .returningAll()
      .execute()
      .try();
    if (err) throw new InternalServerErrorException(err.message);
    return answers;
  }
}
