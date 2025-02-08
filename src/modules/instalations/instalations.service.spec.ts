import { Test, TestingModule } from '@nestjs/testing';
import { InstalationsService } from './instalations.service';

describe('InstalationsService', () => {
  let service: InstalationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstalationsService],
    }).compile();

    service = module.get<InstalationsService>(InstalationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
