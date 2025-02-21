import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogCategory } from "src/modules/blog/blog-categories/entities/blog-category.entity";
import { Repository } from "typeorm";
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
        try {
            for(const item of blogPostsMock ) {
                if(!await this.chechDbData(item.title)) {
                    const { template, category, ...others } = item
                    const existCategory = await this.blogCategoriesRepository.findOne({where: {name: category}})
                    const existTemplate = await this.blogTemplatesRepository.findOne({where:{name: template}})
                    const newPost = {
                        ...others,
                        existCategory,
                        existTemplate,
                    }
                    await this.blogPostsRepository.save(
                        this.blogPostsRepository.create(newPost)
                    )
                    
                }
            }
            console.log('Posts load succesfully')
        } catch(error) {
            console.log({messagge: 'error while load posts', error})
        }

    }

    private async chechDbData(title: string) {
        const post: BlogPost | null = await this.blogPostsRepository.findOneBy({title})
        return !!post
    }
}