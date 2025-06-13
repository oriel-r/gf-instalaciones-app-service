import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base.entity';
import { BlogPost } from 'src/modules/blog/blog-posts/entities/blog-post.entity';
import {
  Column,
  DeepPartial,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class BlogCategory extends BaseEntity {
  @ApiProperty({
    title: 'id',
    description: 'Autogemerated UUID',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    title: 'name',
    description: "category's name",
    type: 'string',
    example: 'Captación de clientes',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({
    title: 'description',
    description: "category's description",
    type: 'string',
    maxLength: 160,
    example: 'An description of the category',
  })
  @Column({ type: 'varchar', nullable: true })
  description: string;

  @ApiProperty({
    title: 'blogPosts',
    description: "category's posts",
  })
  @OneToMany(() => BlogPost, (blogPost) => blogPost.blogCategory, {
    eager: true,
  })
  blogPosts: BlogPost[];

  constructor(partial: DeepPartial<BlogPost>) {
    super();
    Object.assign(this, partial);
  }
}
