import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { templatesMock } from './blog.mock';
import { BlogPostTemplate } from 'src/modules/blog/blog-post-tamplates/entities/blog-template.entity';

@Injectable()
export class BlogTemplatesSeeder {
  constructor(
    @InjectRepository(BlogPostTemplate)
    private readonly blogTemplatesRepository: Repository<BlogPostTemplate>,
  ) {}

  public async seed() {
    try {
      for (const item of templatesMock) {
        if (!(await this.chechDbData(item.name))) {
          await this.blogTemplatesRepository.save(
            this.blogTemplatesRepository.create(item),
          );
        }
      }
      console.log('Templates load succesfully');
    } catch (error) {
      console.log({ messagge: 'error while load templates', error });
    }
  }

  private async chechDbData(name: string) {
    const template: BlogPostTemplate | null =
      await this.blogTemplatesRepository.findOneBy({ name });
    return !!template;
  }
}
