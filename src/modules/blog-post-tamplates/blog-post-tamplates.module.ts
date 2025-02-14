import { Module } from '@nestjs/common';
import { BlogPostTamplatesService } from './blog-post-tamplates.service';
import { BlogPostTamplatesController } from './blog-post-tamplates.controller';

@Module({
  controllers: [BlogPostTamplatesController],
  providers: [BlogPostTamplatesService],
})
export class BlogPostTamplatesModule {}
