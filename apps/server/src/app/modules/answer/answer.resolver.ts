import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AnswerService } from './answer.service';
import { CreateAnswerInput } from './dto/create-answer.input';
import { Answer } from './entity/answer.gql';

@Resolver()
export class AnswerResolver {
  constructor(private readonly service: AnswerService) {}

  @Mutation(() => Answer)
  createAnswers(
    @Args({ name: 'input', type: () => [CreateAnswerInput] })
    createAnswersInput: CreateAnswerInput[]
  ) {
    return this.service.createAnswer(createAnswersInput);
  }
}
