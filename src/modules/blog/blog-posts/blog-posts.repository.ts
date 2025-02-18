import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogPost } from "./entities/blog-post.entity";
import { DeepPartial, DeleteResult, Repository, UpdateResult } from "typeorm";
import { CreateBlogPostDto } from "./dtos/create-post.dto";

@Injectable()
export class BlogPostsRepository {
    constructor(
        @InjectRepository(BlogPost) private readonly blogPostsRepository: Repository<BlogPost>
    ) {}

    async create(data: Partial<BlogPost>): Promise<BlogPost | null> {
        return await this.blogPostsRepository.save(
            this.blogPostsRepository.create(data)
        )
    }

    async get(): Promise<BlogPost[] | void[]> {
        return await this.blogPostsRepository.find()
    }

    async getById(id: string): Promise<BlogPost | null> {
        return await this.blogPostsRepository.findOneBy({id})
    }

    async getByTitle(title: string): Promise<BlogPost | null> {
        return await this.blogPostsRepository.findOneBy({title})
    }

    async update(id: string, data: DeepPartial<BlogPost>): Promise<UpdateResult | null> {
        return await this.blogPostsRepository.update(id, data)
    }
 
    async softDelete(id: string): Promise<DeleteResult | null> {
        return await this.blogPostsRepository.softDelete(id)
    }

    async delete(id: string): Promise<DeleteResult | null> {
        return await this.blogPostsRepository.delete(id)
    }

}