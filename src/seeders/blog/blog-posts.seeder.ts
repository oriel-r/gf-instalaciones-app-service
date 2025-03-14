import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogCategory } from "src/modules/blog/blog-categories/entities/blog-category.entity";
import { DeepPartial, Repository } from "typeorm";
import { BlogPost } from "src/modules/blog/blog-posts/entities/blog-post.entity";
import { blogPostsMock } from "./blog.mock";
import { BlogPostTemplate } from "src/modules/blog/blog-post-tamplates/entities/blog-template.entity";
import { CreateBlogPostDto } from "src/modules/blog/blog-posts/dtos/create-post.dto";

@Injectable()
export class BlogPostsSeeder {
    constructor(
        @InjectRepository(BlogPost)
        private readonly blogPostsRepository: Repository<BlogPost>,
        @InjectRepository(BlogCategory)
        private readonly blogCategoriesRepository: Repository<BlogCategory>,
        @InjectRepository(BlogPostTemplate)
        private readonly blogTemplatesRepository: Repository<BlogPostTemplate>
    ) {}

    public async seed() {
        const posts = await this.blogPostsRepository.find()
        if(!posts || posts.length === 0) {
        try {
            
            for(const item of blogPostsMock ) {
                const {category, template, ...others} = item
                const existCategory = await this.blogCategoriesRepository.findOneBy({name: category})
                const existTemplate = await this.blogTemplatesRepository.findOneBy({name: template})
                if(existCategory && existTemplate) {
                    const newPost = await this.blogPostsRepository.create({
                        ...others,
                        blogCategory: existCategory,
                        blogPostTemplate: existTemplate
                    })
                    await this.blogPostsRepository.save(newPost)
                    }
                }
                return console.log('Posts load succesfully')
        } catch(error) {
            console.log({messagge: 'error while load posts', error})
        }

    }
    }
    
    private async chechDbData(title: string) {
        const post: BlogPost | null = await this.blogPostsRepository.findOneBy({title})
        return !!post
    }
}