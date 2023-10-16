import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { IsPublic } from '../../decorators/public.decorator';
import { CreateSurveyInput } from './dto/create-survey.input';
import { CreatedSurvey } from './gql';
import { SurveyService } from './survey.service';

@Resolver()
export class SurveyResolver {
  constructor(private readonly service: SurveyService) {}

  @IsPublic()
  @Mutation(() => CreatedSurvey)
  createSurvey(@Args('input') input: CreateSurveyInput) {
    return this.service.createSurveyWithQuestions(input);
  }
}
