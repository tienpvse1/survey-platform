import { Test, TestingModule } from '@nestjs/testing';
import { SurveyInstanceService } from './survey-instance.service';

describe('SurveyInstanceService', () => {
  let service: SurveyInstanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyInstanceService],
    }).compile();

    service = module.get<SurveyInstanceService>(SurveyInstanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
