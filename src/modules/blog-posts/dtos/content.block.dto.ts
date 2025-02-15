import { IsArray, IsNotEmpty, IsOptional, IsString } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { BaseDto } from "src/common/entities/base.dto";

export class ContentBlockDto extends BaseDto {
    @ApiProperty({
        title: 'imageUrl',
        description: 'An image url',
        type: 'string'
   })
   @IsString()
   @IsOptional()
   imageUrl: string

   @ApiProperty({
        title: 'videoUrl',
        description: 'an video url',
        type: 'string'
   })
   @IsString()
   @IsOptional()
   videoUrl: string

   @ApiProperty({
        title: 'paragraph',
        description: 'array of strings',
        type: 'array',
        items: {
            type: 'string'
        }
   })
   @IsArray()
   @IsNotEmpty()
   paragraph: string[]

   @ApiProperty({
        title: 'list',
        description: 'list of items',
        type: 'array',
        items: {
            type: 'string'
        }
   })
   @IsArray()
   @IsOptional()
   list: string[]

}