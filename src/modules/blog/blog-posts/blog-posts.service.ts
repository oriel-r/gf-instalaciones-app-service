import { ConflictException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { BlogPostsRepository } from './blog-posts.repository';
import { CreateBlogPostDto } from './dtos/create-post.dto';
import { BlogCategoriesService } from '../blog-categories/blog-categories.service';
import { BlogPost } from './entities/blog-post.entity';

@Injectable()
export class BlogPostsService {
    constructor(
        private readonly blogPostsRepository: BlogPostsRepository,
        private readonly blogCategoriesService: BlogCategoriesService
    ) {}

    async create(data: CreateBlogPostDto) {
        const {category, ...postData} = data
        const categoryExist = await this.blogCategoriesService.getById(category)
        if(!categoryExist) throw new NotFoundException('Categoria invalida')
        const post = {...postData, category: categoryExist}
        const exist = await this.blogPostsRepository.getByTitle(postData.title)
        if (exist) throw new ConflictException('El titulo ya existe')
        return await this.blogPostsRepository.create(post)
    }

    async get(): Promise<BlogPost[] | void[]> {
        const posts = await this.blogPostsRepository.get()
        if(!posts || posts.length < 0) throw new NotFoundException('No se encontraron posts')
            return posts
    }

    async getById(id: string): Promise<BlogPost | null> {
        const post = await this.blogPostsRepository.getById(id)
        if(!post) throw new NotFoundException('No se encontraron posts')
            return post
    }
}

