import { IsArray, IsBoolean, IsNotEmpty, IsString, IsUUID, ValidateNested } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BlogPostStatus } from "src/common";
import { BaseDto } from "src/common/entities/base.dto";
import { ContentBlockDto } from "./content.block.dto";

export class CreateBlogPostDto extends BaseDto {
    
    @ApiProperty({
        title: 'title',
        description: "post's title",
        type: 'string'
    })
    @IsNotEmpty()
    @IsString()
    title: string

    @ApiProperty({
        title: 'category',
        description: "post's category uuid",
        type: 'string'
    })
    @IsNotEmpty()
    @IsUUID()
    category: string

    @ApiProperty({
        title: 'template',
        description: "post's template uuid",
        type: 'string'
    })
    @IsNotEmpty()
    @IsUUID()
    template: string

    @ApiProperty({
        type: 'boolean',
        description: 'This post is highlighted?'
    })
    @IsBoolean()
    @IsNotEmpty()
    isHighlight: boolean

    @ApiProperty({
        title: 'status',
        description: 'Is this post visible?',
        enum: BlogPostStatus
    })
    @IsNotEmpty()
    @IsString()
    status: BlogPostStatus

    @ApiProperty({
        title: 'content',
        description: 'blocks of content',
        type: () => [ContentBlockDto]
    })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({each: true})
    content: ContentBlockDto[]
    
}