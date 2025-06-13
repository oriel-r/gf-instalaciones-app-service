import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ExtendedUserDto } from './dto/signup-user.dto';
import { CredentialsUserDto } from './dto/signin-user.dto';
import { ExtendedInstallerDto } from './dto/signup-installer.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindUserByEmailDto } from '../user/dto/find-user-by-email.dto';
import { RecoveryChangePasswordDto } from './dto/recovery-change-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUpUser')
  async signUpUser(@Body() userDto: ExtendedUserDto) {
    return await this.authService.signUpUser(userDto);
  }

  @Post('signInUser')
  async signInUser(@Body() credentials: CredentialsUserDto) {
    return await this.authService.signInUser(credentials);
  }

  @Post('signUpInstaller')
  async signUpInstaller(@Body() installerDto: ExtendedInstallerDto) {
    return await this.authService.signUpInstaller(installerDto);
  }

  @Post('recovery-request')
  async requestPasswordRecovery(@Body() dto: FindUserByEmailDto) {
    await this.authService.requestPasswordRecovery(dto);
    return {
      message: 'Si el email existe, recibirás un enlace de recuperación.',
    };
  }

  @Post('recovery-change-password')
  async changePassword(@Body() dto: RecoveryChangePasswordDto) {
    await this.authService.changePassword(dto);
    return { message: 'Contraseña cambiada exitosamente.' };
  }
}
