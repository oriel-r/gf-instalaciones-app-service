import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron } from '@nestjs/schedule';
import { SendEmailDto } from '../email/dto/send-email.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Newsletter')
@Injectable()
export class NewsletterService {
   constructor( 
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly mailerService: MailerService
  ) {}

  async subscribe(email: string) {
    const exists = await this.userRepository.findOne({where: {email: email}});
  
    if (!exists) throw new Error('No se encontró un usuario con este email.');
  
    if (exists.isSubscribed) throw new Error('Este email ya está suscrito.');
  
    exists.isSubscribed = true;
    return await this.userRepository.save(exists);
  }
  
  async unsubscribe(email: string) {
      const subscriber = await this.userRepository.findOne({where: {email: email}});
      
      if (!subscriber?.isSubscribed) throw new Error('Este email no está suscrito.');

      subscriber.isSubscribed = false;
      return await this.userRepository.save(subscriber);
    }

  // Se ejecuta todos los lunes a las 9 AM
  @Cron('0 9 * * 1')
  async sendWeeklyNewsletter() {
    const subscribers = await this.userRepository.find({ where: { isSubscribed: true } });

    if (!subscribers.length) return;

    const emails = subscribers.map(sub => sub.email);
    await this.mailerService.sendMail({
      to: emails,
      subject: '📢 GF instalaciones tiene descuentos en instalaciones',
      html: `<h1>¡Noticias frescas de GF Instalaciones!</h1><p>Descubre las últimas novedades.</p>`,
    });

    console.log(`📨 Newsletter enviado a ${emails.length} suscriptores.`);
  }

  async sendNewsletter(sendEmailDto: SendEmailDto) {
    const {to, subject, message } = sendEmailDto;
    const subscribers = await this.userRepository.find({ where: { isSubscribed: true } });

    if (!subscribers.length) return { message: 'No hay suscriptores.' };

    const emails = subscribers.map(sub => sub.email);
    await this.mailerService.sendMail({
      to: emails,
      subject: subject,
      text: message, // Se usa el contenido enviado por el admin
    });

    return { message: `Newsletter enviado a ${emails.length} suscriptores.` };
  }

  findAll() {
    return `This action returns all newsletter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} newsletter`;
  }

  update(id: number) {
    return `This action updates a #${id} newsletter`;
  }

  remove(id: number) {
    return `This action removes a #${id} newsletter`;
  }
}
