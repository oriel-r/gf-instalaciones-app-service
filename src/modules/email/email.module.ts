import { Module } from "@nestjs/common";
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from "./email.controller";
import { EmailService } from "./email.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContactMessage } from "./entities/contact-message.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports:[
        TypeOrmModule.forFeature([ContactMessage]),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            transport: {
              host: configService.get<string>('MAIL_HOST'),
              port: Number(configService.get('MAIL_PORT')),
              secure: false,
              auth: {
                user: configService.get<string>('MAIL_USERNAME'),
                pass: configService.get<string>('MAIL_PASSWORD')?.replace(/_/g, ' '),
              },
            },
            defaults: {
              from: 'GF instalaciones <codigototaldevs@gmail.com>',
            },
          }),
          inject: [ConfigService],
        }),
    ],
    controllers:[EmailController],
    providers:[EmailService],
    exports:[EmailService]
})

export class EmailModule{}