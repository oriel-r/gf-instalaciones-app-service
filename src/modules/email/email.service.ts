import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { SendEmailDto } from "./dto/send-email.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactMessage } from "./entities/contact-message.entity";
import { Repository } from "typeorm";
import { ApiTags } from "@nestjs/swagger";
import { FormContactDto } from "./dto/form-contact.dto";
import { ConfigService } from "@nestjs/config";

@ApiTags('Email')
@Injectable()
export class EmailService{
    constructor(
        private mailerService: MailerService,
        @InjectRepository(ContactMessage)
        private contactMessageRepository: Repository<ContactMessage>,
        private readonly configService: ConfigService, 
    ) {}
    
    async sendEmail(sendEmailDto: SendEmailDto): Promise<string> {
        const { to, subject, message } = sendEmailDto;
        await this.mailerService.sendMail({
            to: to,
            subject: subject,
            text: message,
        });

        return 'Correo electrónico enviado exitosamente.';
    }

    async formContact(formContactDto: FormContactDto) {
        const { surname, from, subject, message } = formContactDto;
      
        await this.mailerService.sendMail({
          to: 'GF Instalaciones <lautarogandodev@gmail.com>',
          from: this.configService.get<string>('EMAIL_FROM'),
          replyTo: from,
          subject: `[Formulario contacto] ${subject}`,
          html: `
            <p><strong>Nombre:</strong> ${surname}</p>
            <p><strong>Email:</strong> ${from}</p>
            <p><strong>Mensaje:</strong></p>
            <p>${message}</p>
          `,
        });
      
        const contactMessage = this.contactMessageRepository.create({
          surname,
          email: from,
          name: subject,
          message,
        });
      
        await this.contactMessageRepository.save(contactMessage);
      
        return `Mensaje enviado con éxito, ${surname}`;
      }
      

    async getAllInfoContact() {
        return await this.contactMessageRepository.find()
    }
}