import { Module } from '@nestjs/common';
import { BlogCategoriesService } from './blog-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategory } from './entities/blog-category.entity';
import { BlogCategoriesRepository } from './blog-categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlogCategory])],
  providers: [BlogCategoriesRepository, BlogCategoriesService],
  exports: [BlogCategoriesService],
})
export class BlogCategoriesModule {}
