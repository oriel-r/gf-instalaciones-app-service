import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ExtendedUserDto } from "./dto/signup-user.dto";
import { CredentialsUserDto } from "./dto/signin-user.dto";
import { ExtendedInstallerDto } from "./dto/signup-installer.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('signupUser')
    async signUpUser (@Body() userDto: ExtendedUserDto) {
        try {
            return await this.authService.signUpUser( userDto )
        } catch (error) {
            throw new HttpException(
                error instanceof Error ? error.message : 'Ocurrió un error inesperado',
                HttpStatus.INTERNAL_SERVER_ERROR
              );
        }
    }

    @Post('signinUser') 
    async signinUser ( @Body() credentials: CredentialsUserDto ) {
        return await this.authService.signinUser(credentials)
    }

    @Post('signupInstaller')
    async signUpInstaller (@Body() installerDto: ExtendedInstallerDto) {
        try {
            return await this.authService.signUpInstaller( installerDto )
        } catch (error) {
            throw new HttpException(
                error instanceof Error ? error.message : 'Ocurrió un error inesperado',
                HttpStatus.INTERNAL_SERVER_ERROR
              );
        }
    }
}