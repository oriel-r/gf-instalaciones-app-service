import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogCategory } from 'src/modules/blog/blog-categories/entities/blog-category.entity';
import { Repository } from 'typeorm';
import { categoriesMock } from './blog.mock';

@Injectable()
export class BlogCategoriesSeeder {
  constructor(
    @InjectRepository(BlogCategory)
    private readonly blogCategoriesRepository: Repository<BlogCategory>,
  ) {}

  public async seed() {
    try {
      for (const item of categoriesMock) {
        if (!(await this.chechDbData(item.name))) {
          await this.blogCategoriesRepository.save(
            this.blogCategoriesRepository.create(item),
          );
        }
      }
      console.log('Categories load succesfully');
    } catch (error) {
      console.log({ messagge: 'error while load categories', error });
    }
  }

  private async chechDbData(name: string) {
    const category: BlogCategory | null =
      await this.blogCategoriesRepository.findOneBy({ name });
    return !!category;
  }
}
