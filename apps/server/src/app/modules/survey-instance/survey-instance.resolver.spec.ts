import { Test, TestingModule } from '@nestjs/testing';
import { SurveyInstanceResolver } from './survey-instance.resolver';
import { SurveyInstanceService } from './survey-instance.service';

describe('SurveyInstanceResolver', () => {
  let resolver: SurveyInstanceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyInstanceResolver, SurveyInstanceService],
    }).compile();

    resolver = module.get<SurveyInstanceResolver>(SurveyInstanceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
