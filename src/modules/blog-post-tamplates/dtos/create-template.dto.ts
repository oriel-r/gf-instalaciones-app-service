import { IsInstance, IsInt, IsNotEmpty, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/common/entities/base.dto";
import { CreateCategoryDto } from "src/modules/blog-categories/dtos/create-blog-category.dto";

export class CreateBlogPostTemplate extends BaseDto {
    
    @ApiProperty({
        title: 'name',
        description: "template's name",
        type: 'string'
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({
        title: 'name',
        description: "template's name",
        type: 'string'
    })
    @IsNotEmpty()
    @IsInt()
    numberOfContentBlocks: number

}