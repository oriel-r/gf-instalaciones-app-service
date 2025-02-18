import { Module } from '@nestjs/common';
import { BlogCategoriesModule } from 'src/modules/blog/blog-categories/blog-categories.module';
import { BlogPostTamplatesModule } from 'src/modules/blog/blog-post-tamplates/blog-post-tamplates.module';
import { BlogPostsModule } from 'src/modules/blog/blog-posts/blog-posts.module';

@Module({
    imports: [BlogPostsModule, BlogCategoriesModule, BlogPostTamplatesModule]
})
export class BlogModule {}
