import { Injectable } from "@nestjs/common";
import { DeepPartial, Repository } from "typeorm";
import { CreateBlogPostTemplate } from "./dtos/create-template.dto";
import { BlogPost } from "../blog-posts/entities/blog-post.entity";
import { BlogPostTemplate } from "./entities/blog-template.entity";

@Injectable()
export class BlogPostTemplatesRepository {
    constructor(private readonly blogPostTemplatesRepository: Repository<BlogPostTemplate>) {}

    async create(data: CreateBlogPostTemplate) {
        return await this.blogPostTemplatesRepository.save(
            this.blogPostTemplatesRepository.create(data)
        )
    }

    async get() {
        return await this.blogPostTemplatesRepository.find()
    }

    async getById(id: string) {
        return await this.blogPostTemplatesRepository.findOneBy({id})
    }

    async update(id: string, data: DeepPartial<BlogPostTemplate>) {
        return await this.blogPostTemplatesRepository.update(id, data)
    }
}