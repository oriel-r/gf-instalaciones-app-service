import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { BlogPostTamplatesService } from './blog-post-tamplates.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlogPostTemplate } from './entities/blog-template.entity';
import { CreateBlogPostTemplate } from './dtos/create-template.dto';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';

@Controller('blog/templates')
export class BlogPostTamplatesController {
  constructor(private readonly blogPostTamplatesService: BlogPostTamplatesService) {}
  
  @ApiOperation({
    summary: "Get all templates",
  })
  @ApiResponse({
    status: 200, type: [BlogPostTemplate],
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get()
  async getAllTemplates(): Promise<BlogPostTemplate[] | HttpException> {
    return await this.blogPostTamplatesService.getAllTemplates()
  }

  @ApiOperation({
    summary: "Get a template by id",
  })
  @ApiResponse({
    status: 200, type: BlogPostTemplate,
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get(':id')
  async getById(@Param('id') id:string): Promise<BlogPostTemplate| HttpException> {
    return await this.blogPostTamplatesService.getTemplateById(id)
  }

  @ApiOperation({
    summary: "Create new template",
  })
  @ApiResponse({
    status: 201, type: BlogPostTemplate,
  })
  @ApiResponse({
    status: 409
  })
  @HttpCode(HttpStatus.CREATED)
  @HttpCode(HttpStatus.CONFLICT)
  @Post()
  async create(@Body() data: CreateBlogPostTemplate): Promise<BlogPostTemplate | HttpException> {
    return await this.blogPostTamplatesService.createTemplate(data)
  }

  @ApiOperation({
    summary: "Soft delete",
  })
  @ApiResponse({
    status: 200, type: DeleteResponse,
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<HttpException | DeleteResponse> {
    return await this.blogPostTamplatesService.softDeleteTemplate(id)
  }
  
}
