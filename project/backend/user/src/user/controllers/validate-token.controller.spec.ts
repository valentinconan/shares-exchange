import { Test, TestingModule } from '@nestjs/testing';
import { ValidateTokenController } from './validate-token.controller';

describe('ValidateTokenController', () => {
  let controller: ValidateTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ValidateTokenController],
    }).compile();

    controller = module.get<ValidateTokenController>(ValidateTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
