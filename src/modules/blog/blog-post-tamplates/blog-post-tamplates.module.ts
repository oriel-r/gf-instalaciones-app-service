import { Module } from '@nestjs/common';
import { BlogPostTamplatesService } from './blog-post-tamplates.service';
import { BlogPostTemplatesRepository } from './blog-post-templates.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPostTemplate } from './entities/blog-template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPostTemplate])],
  providers: [BlogPostTemplatesRepository, BlogPostTamplatesService],
})
export class BlogPostTamplatesModule {}
