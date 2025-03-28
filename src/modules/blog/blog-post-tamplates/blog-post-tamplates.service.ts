import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BlogPostTemplatesRepository } from './blog-post-templates.repository';
import { BlogPostTemplate } from './entities/blog-template.entity';
import { CreateBlogPostTemplate } from './dtos/create-template.dto';
import { DeleteResponse } from 'src/common/entities/delete.response.dto';

@Injectable()
export class BlogPostTamplatesService {
    constructor(private readonly blogPostTemplatesRepository: BlogPostTemplatesRepository) {}

    async createTemplate(data: CreateBlogPostTemplate): Promise< BlogPostTemplate | HttpException> {
        const exist = await this.blogPostTemplatesRepository.getByName(data.name)
        if(exist) throw new ConflictException('Este plantilla ya existe o tiene un nombre repetido')
        return await this.blogPostTemplatesRepository.create(data)
    }

    async getAllTemplates(): Promise<BlogPostTemplate[] | HttpException> {
        const templates = await this.blogPostTemplatesRepository.get()
        if(!templates || templates.length === 0 ) throw new NotFoundException('No se encontraron plantillas')
        return templates
    }

    async getTemplateById(id: string): Promise<BlogPostTemplate | HttpException> {
        const template = await this.blogPostTemplatesRepository.getById(id)
        if(!template) throw new NotFoundException('No se encontro la plantilla')
        return template

    }

    async softDeleteTemplate(id: string): Promise<DeleteResponse | HttpException> {
        const template = await this.blogPostTemplatesRepository.getById(id)
        if(!template) throw new NotFoundException('No se encontro la plantilla')
        const result = await this.blogPostTemplatesRepository.softDelte(id)
        if(!result) throw new InternalServerErrorException('Hubo un problema al eliminar la plantilla')
        return new DeleteResponse('Plantilla', template.id)
    }


}
