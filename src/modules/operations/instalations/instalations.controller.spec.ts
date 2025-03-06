import { Test, TestingModule } from '@nestjs/testing';
import { InstalationsController } from './instalations.controller';
import { InstalationsService } from './instalations.service';

describe('InstalationsController', () => {
  let controller: InstalationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstalationsController],
      providers: [InstalationsService],
    }).compile();

    controller = module.get<InstalationsController>(InstalationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
