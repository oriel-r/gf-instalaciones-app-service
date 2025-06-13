import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { BlogCategoriesService } from './blog-categories.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';
import { BlogCategory } from './entities/blog-category.entity';
import { CreateBlogPostDto } from '../blog-posts/dtos/create-post.dto';
import { CreateCategoryDto } from './dtos/create-blog-category.dto';

@Controller('blog/categories')
export class BlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) {}

  @ApiOperation({
    summary: 'Create a new category',
  })
  @ApiResponse({
    status: 201,
    type: BlogCategory,
  })
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.CONFLICT)
  @Post()
  async create(@Body() data: CreateCategoryDto): Promise<BlogCategory | null> {
    return await this.blogCategoriesService.create(data);
  }

  @ApiOperation({
    summary: 'Get all categories',
  })
  @ApiResponse({
    status: 200,
    type: [BlogCategory],
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get()
  async get(): Promise<BlogCategory[] | void[]> {
    return await this.blogCategoriesService.get();
  }

  @ApiOperation({
    summary: 'Get a categories',
  })
  @ApiResponse({
    status: 200,
    type: BlogCategory,
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<BlogCategory | null> {
    return await this.blogCategoriesService.getById(id);
  }
}
