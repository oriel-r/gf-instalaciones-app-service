import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { InstallerModule } from '../installer/installer.module';
import { InstallerService } from '../installer/installer.service';
import { Installer } from '../installer/entities/installer.entity';
import { CoordinatorsModule } from '../coordinators/coordinators.module';
import { UserRoleModule } from '../user-role/user-role.module';
import { Role } from '../user/entities/roles.entity';
import { Coordinator } from '../coordinators/entities/coordinator.entity';
import { CoordinatorsService } from '../coordinators/coordinators.service';
import { AdminModule } from '../admins/admins.module';
import { UserRole } from '../user-role/entities/user-role.entity';
import { PasswordResetToken } from './entities/passwordResetToken.entity';
import { EmailService } from '../email/email.service';
import { ContactMessage } from '../email/entities/contact-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Installer,
      Role,
      Coordinator,
      UserRole,
      PasswordResetToken,
      ContactMessage,
    ]),
    UserModule,
    UserRoleModule,
    InstallerModule,
    CoordinatorsModule,
    AdminModule,
    JwtModule.register({
      signOptions: { expiresIn: '1h' },
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [
    AuthService,
    UserService,
    InstallerService,
    CoordinatorsService,
    EmailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
