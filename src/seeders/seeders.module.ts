import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/modules/user/entities/user.entity';
import { UserSeeds } from './users/user.seeds';
import { Role } from 'src/modules/user/entities/roles.entity';
import { BlogModule } from './blog/blog.sseder.module';
import { BlogCategoriesSeeder } from './blog/blog-categories.seeder';
import { BlogCategory } from 'src/modules/blog/blog-categories/entities/blog-category.entity';
import { BlogPostTemplate } from 'src/modules/blog/blog-post-tamplates/entities/blog-template.entity';
import { BlogPost } from 'src/modules/blog/blog-posts/entities/blog-post.entity';
import { BlogTemplatesSeeder } from './blog/blog-templates.seeder';
import { BlogPostsSeeder } from './blog/blog-posts.seeder';
import { Installer } from 'src/modules/installer/entities/installer.entity';
import { UserRole } from 'src/modules/user-role/entities/user-role.entity';
import { UserRoleModule } from 'src/modules/user-role/user-role.module';
import { LocationsSeeder } from './locations/locations.seeds';
import { Admin } from 'src/modules/admins/entities/admins.entity';
import { Coordinator } from 'src/modules/coordinators/entities/coordinator.entity';
import { OrdersSeeder } from './orders/orders.seeds';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      BlogCategory,
      BlogPostTemplate,
      BlogPost,
      Installer,
      UserRole,
      Admin,
      Coordinator,
    ]),
    UserRoleModule,
    JwtModule,
    BlogModule,
  ],
  providers: [
    UserSeeds,
    BlogCategoriesSeeder,
    BlogTemplatesSeeder,
    BlogPostsSeeder,
    LocationsSeeder,
    OrdersSeeder,
  ],
  exports: [
    UserSeeds,
    BlogCategoriesSeeder,
    BlogTemplatesSeeder,
    LocationsSeeder,
    BlogPostsSeeder,
    OrdersSeeder,
  ],
})
export class SeedersModule {}
