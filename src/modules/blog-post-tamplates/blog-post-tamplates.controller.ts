import { Controller } from '@nestjs/common';
import { BlogPostTamplatesService } from './blog-post-tamplates.service';

@Controller('blog-post-tamplates')
export class BlogPostTamplatesController {
  constructor(private readonly blogPostTamplatesService: BlogPostTamplatesService) {}
}
