import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { SendEmailDto } from '../email/dto/send-email.dto';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  async subscribe(@Body('email') email: string) {
    return this.newsletterService.subscribe(email);
  }

  @Post('unsubscribe')
  async unsubscribe(@Body('email') email: string) {
    try {
      return await this.newsletterService.unsubscribe(email);
    } catch (error) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }

  @Post('send')
  async sendNewsletter(@Body() sendEmailDto: SendEmailDto) {
    const {to, subject, message } = sendEmailDto;
    return this.newsletterService.sendNewsletter({to, subject, message});
  }

  @Get()
  findAll() {
    return this.newsletterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsletterService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.newsletterService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsletterService.remove(+id);
  }
}
