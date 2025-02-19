import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogCategory } from "./entities/blog-category.entity";
import { privateDecrypt } from "crypto";
import { Repository } from "typeorm";
import { CreateCategoryDto } from "./dtos/create-blog-category.dto";

@Injectable()
export class BlogCategoriesRepository {
    constructor(
        @InjectRepository(BlogCategory) private readonly blogCategoriesRepository: Repository <BlogCategory>
    ) {}

    async create(data: CreateCategoryDto): Promise<BlogCategory | null> {
        return await this.blogCategoriesRepository.save(
            this.blogCategoriesRepository.create(data)
        )
    }

    async get(): Promise<BlogCategory[] | void[]> {
        return await this.blogCategoriesRepository.find()
    }

    async getById(id:string): Promise<BlogCategory | null> {
        return await this.blogCategoriesRepository.findOneBy({id})
    }

    async getByName(name:string): Promise<BlogCategory | null> {
        return await this.blogCategoriesRepository.findOneBy({name})
    }

}