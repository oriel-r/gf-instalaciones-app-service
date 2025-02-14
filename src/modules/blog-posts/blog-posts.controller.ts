import { Controller } from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';

@Controller('blog-posts')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}
}
