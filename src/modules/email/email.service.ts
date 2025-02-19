import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { SendEmailDto } from "./dto/send-email.dto";
import { formContactDto } from "./dto/form-contact.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ContactMessage } from "./entities/contact-message.entity";
import { Repository } from "typeorm";

@Injectable()
export class EmailService{
    constructor(
        private mailerService: MailerService,
        @InjectRepository(ContactMessage)
        private contactMessageRepository: Repository<ContactMessage>
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

    async formContact(formContactDto: formContactDto) {
        const { surname, from, subject, message } = formContactDto;
        await this.mailerService.sendMail({
          from: from,
          to: 'GF Instalaciones <codigototaldevs@gmail.com>',
          subject: subject,
          html: message,
        });

        const email = from;
        const name = subject;

        const contactMessage = this.contactMessageRepository.create({
            surname,
            email,
            name,
            message,
          });
          await this.contactMessageRepository.save(contactMessage);

        return  `Mensaje enviado con éxito , ${ContactMessage}`        
    }
}