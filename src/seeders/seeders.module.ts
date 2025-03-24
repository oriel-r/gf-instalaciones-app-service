import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { User } from "src/modules/user/entities/user.entity";
import { UsersSeeds } from "./users/user.seeds";
import { Role } from "src/modules/user/entities/roles.entity";
import { BlogModule } from './blog/blog.sseder.module';
import { BlogCategoriesSeeder } from "./blog/blog-categories.seeder";
import { BlogCategoriesRepository } from "src/modules/blog/blog-categories/blog-categories.repository";
import { BlogCategory } from "src/modules/blog/blog-categories/entities/blog-category.entity";
import { BlogPostTemplate } from "src/modules/blog/blog-post-tamplates/entities/blog-template.entity";
import { BlogPost } from "src/modules/blog/blog-posts/entities/blog-post.entity";
import { BlogTemplatesSeeder } from "./blog/blog-templates.seeder";
import { BlogPostsSeeder } from "./blog/blog-posts.seeder";
import { Installer } from "src/modules/installer/entities/installer.entity";
import { UserRole } from "src/modules/user-role/entities/user-role.entity";
import { UserRoleModule } from "src/modules/user-role/user-role.module";
import { LocationsSeeder } from "./locations/locations.seeds";
import { OrdersSeeder } from "./orders/orders.seeds";

@Module({
    imports:[TypeOrmModule.forFeature([User,Role, BlogCategory, BlogPostTemplate, BlogPost, Installer, UserRole]),
    UserRoleModule,
    JwtModule,
    BlogModule,
],
    providers: [UsersSeeds, BlogCategoriesSeeder, BlogTemplatesSeeder, BlogPostsSeeder, LocationsSeeder, OrdersSeeder],
    exports: [UsersSeeds, BlogCategoriesSeeder, BlogTemplatesSeeder, LocationsSeeder, BlogPostsSeeder, OrdersSeeder],
})

export class SeedersModule {}
