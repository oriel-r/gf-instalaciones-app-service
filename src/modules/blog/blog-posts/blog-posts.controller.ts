import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dtos/create-post.dto';
import { DeleteResponse } from 'src/common/entities/delete.response';

@Controller('blog/posts')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

    @ApiOperation({
      summary: "Get all posts",
    })
    @ApiResponse({
      status: 200, type: [BlogPost],
    })
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.NOT_FOUND)
    @Get()
    async get(): Promise<BlogPost[] | void[]> {
      return await this.blogPostsService.get()
    }

    @ApiOperation({
      summary: "Get a posts by id",
    })
    @ApiResponse({
      status: 200, type: BlogPost,
    })
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.NOT_FOUND)
    @Get(':id')
    async getById(@Param('id') id: string): Promise<BlogPost | null> {
      return await this.blogPostsService.getById(id)
    }

    @ApiOperation({
      summary: "Create a new post",
    })
    @ApiResponse({
      status: 201, type: BlogPost,
    })
    @HttpCode(HttpStatus.CREATED)
    @HttpCode(HttpStatus.NOT_FOUND)
    @HttpCode(HttpStatus.CONFLICT)
    @Post()
    async create(@Body() data:CreateBlogPostDto): Promise<BlogPost | null> {
      return await this.blogPostsService.create(data)
    }

    @ApiOperation({
      summary: "Delete a post",
    })
    @ApiResponse({
      status: 200, type: DeleteResponse,
    })
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.NOT_FOUND)
    @Delete(':id')
    async softDelete(@Param('id') id: string): Promise<DeleteResponse | undefined> {
      return await this.blogPostsService.softDelete(id)
    }

}
