import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ExtendedUserDto } from "./dto/signup-user.dto";
import { hash, compare } from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { CredentialsUserDto } from "./dto/signin-user.dto";
import { InstallerService } from "../installer/installer.service";
import { ExtendedInstallerDto } from "./dto/signup-installer.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
@Injectable() 
export class AuthService {
    constructor(
        private readonly installerService: InstallerService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async signUpUser ( userDto: ExtendedUserDto) {
        if(userDto.password !== userDto.repeatPassword) {
            throw new HttpException('Las contraseñas no coinciden', HttpStatus.BAD_REQUEST);
        }

        userDto.password = await hash(userDto.password, 10);

        const user = await this.userService.createUser(userDto);
        return user;
    }

    async signinUser(credentials: CredentialsUserDto) {
        const user = await this.userService.findByEmail(credentials.email);
        if(!user){
          throw new HttpException('Usuario, contraseña incorrecta', 404);
        }else{
          
        }
        
        const isPasswordMatching = await compare(
            credentials.password,
            user.password,
          );
      
          if (!isPasswordMatching) {
            throw new HttpException(
              'Credenciales Incorrectas',
              HttpStatus.UNAUTHORIZED,
            );
          }

          const userPayload = {
            id: user.id,
            email: user.email,
            /* role: user.role, */
          }

          const token = this.jwtService.sign(userPayload);

          return {token, user}
    }

    async signUpInstaller ( installerDto: ExtendedInstallerDto ) {
      if(installerDto.password !== installerDto.repeatPassword) {
          throw new HttpException('Las contraseñas no coinciden', HttpStatus.BAD_REQUEST);
      }

      installerDto.password = await hash(installerDto.password, 10);

      const installer = await this.installerService.createInstaller(installerDto);
      return installer;
  }  
}