import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { FormContactDto } from './dto/form-contact.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RoleEnum } from 'src/common/enums/user-role.enum';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('sendEmail')
  async sendGeneralEmail(@Body() sendEmailDto: SendEmailDto) {
    try {
      const { from, to, subject, message } = sendEmailDto;
      return await this.emailService.sendEmail({ from, to, subject, message });
    } catch (error) {
      throw new HttpException(
        `Error al enviar el correo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('formContact')
  async formContact(@Body() formContactDto: FormContactDto) {
    try {
      const { surname, from, subject, message } = formContactDto;
      return this.emailService.formContact({ surname, from, subject, message });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error enviando el formulario: ${error.message}`,
      );
    }
  }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async getAllInfoContact() {
    return await this.emailService.getAllInfoContact();
  }
}
