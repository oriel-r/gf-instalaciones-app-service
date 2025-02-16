import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostTamplatesService } from './blog-post-tamplates.service';

describe('BlogPostTamplatesService', () => {
  let service: BlogPostTamplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlogPostTamplatesService],
    }).compile();

    service = module.get<BlogPostTamplatesService>(BlogPostTamplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
