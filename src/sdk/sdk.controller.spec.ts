import { Test, TestingModule } from '@nestjs/testing';
import { SdkController } from './sdk.controller';
import { SdkService } from './sdk.service';

describe('SdkController', () => {
  let controller: SdkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SdkController],
      providers: [SdkService],
    }).compile();

    controller = module.get<SdkController>(SdkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
