import { Injectable } from "@nestjs/common";
import { DeepPartial, DeleteResult, Repository } from "typeorm";
import { CreateBlogPostTemplate } from "./dtos/create-template.dto";
import { BlogPost } from "../blog-posts/entities/blog-post.entity";
import { BlogPostTemplate } from "./entities/blog-template.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class BlogPostTemplatesRepository {
    constructor(
        @InjectRepository(BlogPostTemplate) private readonly blogPostTemplatesRepository: Repository<BlogPostTemplate>
    ) {}

    async create(data: CreateBlogPostTemplate) {
        return await this.blogPostTemplatesRepository.save(
            this.blogPostTemplatesRepository.create(data)
        )
    }

    async get() {
        return await this.blogPostTemplatesRepository.find({
            relations: {blogPosts: true}
        })
    }

    async getById(id: string) {
        return await this.blogPostTemplatesRepository.findOneBy({id})
    }

    async getByName(name: string) {
        return await this.blogPostTemplatesRepository.findOneBy({name})
    }

    async update(id: string, data: DeepPartial<BlogPostTemplate>) {
        return await this.blogPostTemplatesRepository.update(id, data)
    }

    async softDelte(id: string) {
        return await this.blogPostTemplatesRepository.softDelete(id)
    }

    async delete(id: string): Promise<DeleteResult | undefined>{
        return await this.blogPostTemplatesRepository.delete(id)
    }
}