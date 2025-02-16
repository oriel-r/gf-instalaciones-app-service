import { Module } from '@nestjs/common';
import { BlogCategoriesService } from './blog-categories.service';
import { BlogCategoriesController } from './blog-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogCategory } from './entities/blog-category.entity';
import { BlogCategoriesRepository } from './blog-categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BlogCategory])],
  controllers: [BlogCategoriesController],
  providers: [BlogCategoriesRepository, BlogCategoriesService],
  exports: [BlogCategoriesService]
})
export class BlogCategoriesModule {}
