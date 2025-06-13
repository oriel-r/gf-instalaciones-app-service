import { forwardRef, Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => UserModule)],
  providers: [NewsletterService],
})
export class NewsletterModule {}
