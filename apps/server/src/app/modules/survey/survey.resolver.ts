import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { User } from '../../decorators';
import { User as UserGql } from '../user/entities/user.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { Survey } from './gql';
import { SurveyService } from './survey.service';

@Resolver(() => Survey)
export class SurveyResolver {
  private userLoader: DataLoader<string, any, string>;
  constructor(private readonly service: SurveyService) {
    this.userLoader = new DataLoader(this.service.loadUsers);
  }

  @Query(() => [Survey])
  surveys(@User('id') userId: string) {
    return this.service.getOwnSurveys(userId);
  }

  @Mutation(() => Survey)
  createSurvey(
    @Args('input') input: CreateSurveyInput,
    @User('id') userId: string
  ) {
    return this.service.createSurveyWithQuestions(input, userId);
  }

  @ResolveField(() => UserGql)
  creator(@Parent() { createdById }: Survey) {
    return this.userLoader.load(createdById);
  }
}
