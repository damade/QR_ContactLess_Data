import { Test, TestingModule } from '@nestjs/testing';
import { LoaninfoService } from './loaninfo.service';

describe('LoaninfoService', () => {
  let service: LoaninfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoaninfoService],
    }).compile();

    service = module.get<LoaninfoService>(LoaninfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
