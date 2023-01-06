import { Test, TestingModule } from '@nestjs/testing';
import { LoanrequestController } from './loanrequest.controller';

describe('LoanrequestController', () => {
  let controller: LoanrequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanrequestController],
    }).compile();

    controller = module.get<LoanrequestController>(LoanrequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
