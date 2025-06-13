import { Module } from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { BlogPostsRepository } from './blog-posts.repository';
import { BlogCategoriesModule } from '../blog-categories/blog-categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost]), BlogCategoriesModule],
  providers: [BlogPostsRepository, BlogPostsService],
})
export class BlogPostsModule {}
