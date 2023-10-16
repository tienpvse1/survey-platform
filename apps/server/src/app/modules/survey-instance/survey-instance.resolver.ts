import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { IsPublic } from '../../decorators/public.decorator';
import { UUID } from '../../scalars';
import { CreateSurveyInstanceInput } from './dto/create-survey-instance.input';
import { SurveyInstance } from './entity/survey-instance.gql';
import { SurveyInstanceService } from './survey-instance.service';

@Resolver()
export class SurveyInstanceResolver {
  constructor(private readonly service: SurveyInstanceService) {}

  @Mutation(() => SurveyInstance)
  @IsPublic()
  createSurveyInstance(@Args('input') input: CreateSurveyInstanceInput) {
    return this.service.createSurvey(input);
  }

  @Mutation(() => SurveyInstance)
  @IsPublic()
  startSurvey(
    @Args({ name: 'surveyId', type: () => UUID }) surveyInstanceId: string
  ) {
    return this.service.startSurvey(surveyInstanceId);
  }

  @Mutation(() => SurveyInstance)
  @IsPublic()
  dropSurvey(
    @Args({ name: 'surveyId', type: () => UUID }) surveyInstanceId: string
  ) {
    return this.service.dropOff(surveyInstanceId);
  }
}
