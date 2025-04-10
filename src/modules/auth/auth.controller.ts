import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ExtendedUserDto } from './dto/signup-user.dto';
import { CredentialsUserDto } from './dto/signin-user.dto';
import { ExtendedInstallerDto } from './dto/signup-installer.dto';
import { ApiTags } from '@nestjs/swagger';

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
}
