import { Test, TestingModule } from '@nestjs/testing';
import { LoaninfoController } from './loaninfo.controller';

describe('LoaninfoController', () => {
  let controller: LoaninfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoaninfoController],
    }).compile();

    controller = module.get<LoaninfoController>(LoaninfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
