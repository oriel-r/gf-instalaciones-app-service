import { Injectable } from '@nestjs/common';
import { BlogPostTemplatesRepository } from './blog-post-templates.repository';

@Injectable()
export class BlogPostTamplatesService {
    constructor(private readonly blogPostTemplatesRepository: BlogPostTemplatesRepository) {}
}
