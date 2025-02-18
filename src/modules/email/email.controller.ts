import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { formContactDto } from './dto/form-contact.dto';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('sendEmail')
  @HttpCode(HttpStatus.OK)
  async sendMail(@Body() sendEmailDto: SendEmailDto) {
    try {
      const { from, to, subject, message } = sendEmailDto;
      return await this.emailService.sendEmail({ from, to, subject, message });
    } catch (error) {
      throw new Error(`Error enviando el correo: ${error.message}`);
    }
  }

  @Post('formContact')
  @HttpCode(HttpStatus.CREATED)
  async formContact(@Body() formContactDto: formContactDto) {
    try {
      const { surname, from, subject, message } = formContactDto;
      return this.emailService.formContact({ surname, from, subject, message });
    } catch (error) {
      throw new Error(`Error enviando el formulario: ${error.message}`);
    }
  }
}
