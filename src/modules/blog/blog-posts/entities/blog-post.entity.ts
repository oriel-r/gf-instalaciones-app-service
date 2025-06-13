import { ApiProperty } from '@nestjs/swagger';
import { BlogPostStatus } from 'src/common';
import { BaseEntity } from 'src/common/entities/base.entity';
import { BlogCategory } from 'src/modules/blog/blog-categories/entities/blog-category.entity';
import { BlogPostTemplate } from 'src/modules/blog/blog-post-tamplates/entities/blog-template.entity';
import { ContentBlockDto } from 'src/modules/blog/blog-posts/dtos/content.block.dto';
import {
  Column,
  DeepPartial,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BlogPost extends BaseEntity {
  @ApiProperty({
    title: 'id',
    description: 'Autogemerated UUID',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    title: 'title',
    description: "post's title",
    type: 'string',
  })
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @ApiProperty({
    title: 'isHighlight',
    description:
      'indicate if this post is highliht. An only highlight article is allowed',
    type: 'boolean',
  })
  @Column({ type: 'boolean', default: true })
  isHighlight: boolean;

  @ApiProperty({
    title: 'postCategory',
    description: "post's category",
    required: true,
  })
  @ManyToOne(() => BlogCategory, (blogCategory) => blogCategory.blogPosts, {
    onDelete: 'SET NULL',
  })
  blogCategory: BlogCategory;

  @ApiProperty({
    title: 'blogPostTemplate',
    description: 'the template in use in this post',
    required: true,
  })
  @ManyToOne(
    () => BlogPostTemplate,
    (blogPostTemplate) => blogPostTemplate.blogPosts,
    { eager: true },
  )
  blogPostTemplate: BlogPostTemplate;

  @ApiProperty({
    title: 'status',
    description: "blog post's status",
    type: 'string',
    enum: BlogPostStatus,
  })
  @Column({ type: 'varchar', default: BlogPostStatus.Published })
  status: string;

  @ApiProperty({
    title: 'content',
    description: "post's content in JSONB format",
    type: () => [ContentBlockDto],
  })
  @Column('jsonb', { nullable: false })
  content: ContentBlockDto[];

  constructor(partial: DeepPartial<BlogPost>) {
    super();
    Object.assign(this, partial);
  }
}
