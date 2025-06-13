import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogCategoriesRepository } from './blog-categories.repository';
import { CreateCategoryDto } from './dtos/create-blog-category.dto';
import { BlogCategory } from './entities/blog-category.entity';

@Injectable()
export class BlogCategoriesService {
  constructor(
    private readonly blogCategoriesRepository: BlogCategoriesRepository,
  ) {}

  async create(data: CreateCategoryDto): Promise<BlogCategory | null> {
    const exist = await this.blogCategoriesRepository.getByName(data.name);
    if (exist)
      throw new ConflictException(
        'Esta categoria ya existe o tiene un nombre ya utilizado',
      );
    return await this.blogCategoriesRepository.create(data);
  }

  async get(): Promise<BlogCategory[] | void[]> {
    const categories = await this.blogCategoriesRepository.get();
    if (!categories || categories.length < 0)
      throw new NotFoundException('No se encontraron categorias');
    return categories;
  }

  async getById(id: string): Promise<BlogCategory | null> {
    const category = await this.blogCategoriesRepository.getById(id);
    if (!category) throw new NotFoundException('Categoria no encontrada');
    return category;
  }

  async getByName(name: string): Promise<BlogCategory | null> {
    const category = await this.blogCategoriesRepository.getByName(name);
    if (!category) throw new NotFoundException('Categoria no encontrada');
    return category;
  }
}
