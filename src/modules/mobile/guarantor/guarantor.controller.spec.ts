import { Test, TestingModule } from '@nestjs/testing';
import { GuarantorController } from './guarantor.controller';

describe('GuarantorController', () => {
  let controller: GuarantorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuarantorController],
    }).compile();

    controller = module.get<GuarantorController>(GuarantorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
