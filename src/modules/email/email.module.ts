import { Module } from "@nestjs/common";
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactMessage } from "./entities/contact-message.entity";

@Module({
    imports:[
        TypeOrmModule.forFeature([ContactMessage]),
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: false,
                auth: {
                  user: process.env.MAIL_USERNAME,
                  pass: process.env.MAIL_PASSWORD!.replace(/_/g, ' '),
                },
              },
              defaults: {
                from: 'GF instalaciones <codigototaldevs@gmail.com>',
              },
        })
    ],
    controllers:[EmailController],
    providers:[EmailService],
    exports:[EmailService]
})

export class EmailModule{}