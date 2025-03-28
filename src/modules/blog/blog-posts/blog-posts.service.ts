import { ConflictException, HttpCode, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { BlogPostsRepository } from './blog-posts.repository';
import { CreateBlogPostDto } from './dtos/create-post.dto';
import { BlogCategoriesService } from '../blog-categories/blog-categories.service';
import { BlogPost } from './entities/blog-post.entity';
import { DeepPartial, UpdateResult } from 'typeorm';
import { isEqual } from 'src/common';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';

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

    async get(category?: string): Promise<BlogPost[] | void []> {
        let posts: BlogPost[] | void[] = [];
      
        if (category) {
          const existCategory = await this.blogCategoriesService.getByName(category);
          if (!existCategory) {
            throw new NotFoundException(`No existe la categoría con nombre "${category}"`);
          }
          posts = await this.blogPostsRepository.get(existCategory); 
        } 
        else {
          posts = await this.blogPostsRepository.get();
        }
      
        if (!posts || posts.length === 0) throw new NotFoundException('No se encontraron posts');
      
        return posts;
      }

    async getById(id: string): Promise<BlogPost | null> {
        const post = await this.blogPostsRepository.getById(id)
        if(!post) throw new NotFoundException('No se encontraron posts')
            return post
    }

    async getByTitle(title: string): Promise<BlogPost | null> {
        const post = await this.blogPostsRepository.getByTitle(title)
        if(!post) throw new NotFoundException('No se encontro el post')
            return post
    }

    async update(anId: string, data: DeepPartial<BlogPost>): Promise<UpdateResult | null> {
        const existPost = await this.blogPostsRepository.getById(anId)
        if(!existPost) throw new NotFoundException('No se encontro el post')
        const {id, ...oldData} = existPost
        if(isEqual(data, oldData)) throw new HttpException('No hay cambios para aplicar', HttpStatus.NO_CONTENT)
        return await this.blogPostsRepository.update(anId, data)
    }

    async softDelete(id: string): Promise<DeleteResponse | undefined> {
        const existPost = await this.blogPostsRepository.getById(id)
        if(!existPost) throw new NotFoundException('Post no encontrado o ID invalido')
        const result = await this.blogPostsRepository.softDelete(id)
        if(result) return new DeleteResponse('Post', id, 'Se elimino el post')
    }
}

