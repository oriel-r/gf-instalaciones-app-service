import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ExtendedUserDto } from './dto/signup-user.dto';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CredentialsUserDto } from './dto/signin-user.dto';
import { InstallerService } from '../installer/installer.service';
import { ExtendedInstallerDto } from './dto/signup-installer.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateInstallerDto } from '../installer/dto/create-installer.dto';
import { RoleEnum } from 'src/common/enums/user-role.enum';

@ApiTags('Auth')
@Injectable()
export class AuthService {
  constructor(
    private readonly installerService: InstallerService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUpUser(userDto: ExtendedUserDto) {
    if (userDto.password !== userDto.repeatPassword) {
      throw new HttpException(
        'Las contraseñas no coinciden',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.createUser(userDto);
    return user;
  }

  async signInUser(credentials: CredentialsUserDto) {
    const userDisabled = await this.userService.userByEmailByDisabled(credentials.emailSignIn);

    if (userDisabled) {
      throw new HttpException(
        'Correo electrónico inhabilitado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.userService.findByEmail(credentials.emailSignIn);
  
    if (!user) {
      throw new HttpException('Usuario, contraseña incorrecta', 404);
    }
  
    const isPasswordMatching = await compare(
      credentials.passwordSignIn,
      user.password,
    );
  
    if (!isPasswordMatching) {
      throw new HttpException(
        'Credenciales Incorrectas',
        HttpStatus.UNAUTHORIZED,
      );
    }
  
    const roles: RoleEnum[] = user.userRoles.map((ur) => ur.role.name as RoleEnum);

    if (roles.includes(RoleEnum.INSTALLER) && user.installer) {
      if (
        user.installer.status === 'EN PROCESO' ||
        user.installer.status === 'RECHAZADO'
      ) {
        throw new HttpException(
          'Necesita ser aprobado',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  
    const userPayload = {
      id: user.id,
      email: user.email,
      roles,
    };
  
    const token = this.jwtService.sign(userPayload);
  
    return { token, user };
  }
  
  async signUpInstaller(dto: ExtendedInstallerDto) {
    const { repeatPassword, password, ...rest } = dto;

    if (password !== repeatPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const user = await this.userService.createUser({
      ...rest,
      password,
    });

    const installerDto: CreateInstallerDto = {
      userId: user.id,
      taxCondition: dto.taxCondition,
      queries: dto.queries,
      hasPersonalAccidentInsurance: dto.hasPersonalAccidentInsurance,
      canWorkAtHeight: dto.canWorkAtHeight,
      canTensionFrontAndBackLonas: dto.canTensionFrontAndBackLonas,
      canInstallCorporealSigns: dto.canInstallCorporealSigns,
      canInstallFrostedVinyl: dto.canInstallFrostedVinyl,
      canInstallVinylOnWallsOrGlass: dto.canInstallVinylOnWallsOrGlass,
      canDoCarWrapping: dto.canDoCarWrapping,
      hasOwnTransportation: dto.hasOwnTransportation,
      status: dto.status,
    };

    const installer = await this.installerService.createInstaller(installerDto);

    return installer;
  }
}
