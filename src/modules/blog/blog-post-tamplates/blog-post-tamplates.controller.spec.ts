import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostTamplatesController } from './blog-post-tamplates.controller';
import { BlogPostTamplatesService } from './blog-post-tamplates.service';

describe('BlogPostTamplatesController', () => {
  let controller: BlogPostTamplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogPostTamplatesController],
      providers: [BlogPostTamplatesService],
    }).compile();

    controller = module.get<BlogPostTamplatesController>(BlogPostTamplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
