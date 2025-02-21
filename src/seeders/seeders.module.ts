import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { User } from "src/modules/user/entities/user.entity";
import { UserSeeds } from "./users/user.seeds";
import { BlogModule } from './blog/blog.sseder.module';
import { BlogCategoriesSeeder } from "./blog/blog-categories.seeder";
import { BlogCategoriesRepository } from "src/modules/blog/blog-categories/blog-categories.repository";
import { BlogCategory } from "src/modules/blog/blog-categories/entities/blog-category.entity";
import { BlogPostTemplate } from "src/modules/blog/blog-post-tamplates/entities/blog-template.entity";
import { BlogPost } from "src/modules/blog/blog-posts/entities/blog-post.entity";
import { BlogTemplatesSeeder } from "./blog/blog-templates.seeder";
import { BlogPostsSeeder } from "./blog/blog-posts.seeder";

@Module({
    imports:[TypeOrmModule.forFeature([User, BlogCategory, BlogPostTemplate, BlogPost]),
    JwtModule,
    BlogModule,
],
    providers: [UserSeeds, BlogCategoriesSeeder, BlogTemplatesSeeder, BlogPostsSeeder],
    exports: [UserSeeds, BlogCategoriesSeeder, BlogTemplatesSeeder ],
})

export class SeedersModule {}
