import { forwardRef, Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]), forwardRef(() => UserModule)],
  controllers: [NewsletterController],
  providers: [NewsletterService],
})
export class NewsletterModule {}
