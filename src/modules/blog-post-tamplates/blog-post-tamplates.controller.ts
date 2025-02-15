import { Controller, Get, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { BlogPostTamplatesService } from './blog-post-tamplates.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlogPostTemplate } from './entities/blog-template.entity';

@Controller('blog-post-tamplates')
export class BlogPostTamplatesController {
  constructor(private readonly blogPostTamplatesService: BlogPostTamplatesService) {}
  
  @ApiOperation({
    summary: "Get all templates",
  })
  @HttpCode(HttpStatus.OK)
  @HttpCode(HttpStatus.NOT_FOUND)
  @Get()
  async getAllTemplates(): Promise<BlogPostTemplate[] | HttpException> {
    return await this.blogPostTamplatesService.getAllTemplates()
  }
}
