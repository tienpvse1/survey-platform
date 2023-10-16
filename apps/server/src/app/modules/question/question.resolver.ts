import { Resolver } from '@nestjs/graphql';
import { QuestionService } from './question.service';

@Resolver()
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}
}
