import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ExtendedUserDto } from './dto/signup-user.dto';
import { compare } from 'bcrypt';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CredentialsUserDto } from './dto/signin-user.dto';
import { InstallerService } from '../installer/installer.service';
import { ExtendedInstallerDto } from './dto/signup-installer.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateInstallerDto } from '../installer/dto/create-installer.dto';
import { RoleEnum } from 'src/common/enums/user-role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { UserSummaryDto } from '../user/dto/user-summary.dto';
import { PasswordResetToken } from './entities/passwordResetToken.entity';
import { EmailService } from '../email/email.service';
import { FindUserByEmailDto } from '../user/dto/find-user-by-email.dto';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { RecoveryChangePasswordDto } from './dto/recovery-change-password.dto';
import { RolePayload } from 'src/common/entities/role-payload.dto';
import { StatusInstaller } from 'src/common/enums/status-installer';

@ApiTags('Auth')
@Injectable()
export class AuthService {
  constructor(
    private readonly installerService: InstallerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepositoy: Repository<PasswordResetToken>,

    private readonly emailService: EmailService,
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
    const userDisabled = await this.userService.userByEmailByDisabled(
      credentials.emailSignIn,
    );

    if (userDisabled) {
      throw new HttpException(
        'Correo electrónico inhabilitado',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const anUser = await this.userRepository.findOne({
      where: { email: credentials.emailSignIn },
      relations: ['userRoles', 'userRoles.role', 'installer'],
    });

    if (!anUser) {
      throw new HttpException('Usuario, contraseña incorrecta', 404);
    }

    const isPasswordMatching = await compare(
      credentials.passwordSignIn,
      anUser.password,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Credenciales Incorrectas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const roles = anUser.userRoles.filter((ur) => ur.isActive)

    const isInstaller = roles.some((userRole) => userRole.role.name === RoleEnum.INSTALLER)

    if (isInstaller && anUser.installer) {
      if (
        anUser.installer.status === StatusInstaller.InProcess ||
        anUser.installer.status === StatusInstaller.Refused
      ) {
        throw new HttpException(
          'Necesita ser aprobado',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    const userPayload = {
      id: anUser.id,
      email: anUser.email,
      roles: roles.map(ur => new RolePayload(ur)),
      installerId:
        isInstaller && anUser.installer
          ? anUser.installer.id
          : null,
    };

    const token = this.jwtService.sign(userPayload);

    const user = plainToInstance(UserSummaryDto, anUser, {
      excludeExtraneousValues: true,
    });

    return { token, user: anUser };
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

  async requestPasswordRecovery(dto: FindUserByEmailDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      return;
    }

    const token = uuidv4();
    const expiresAt = addHours(new Date(), 1);

    const recovery = this.passwordResetTokenRepositoy.create({
      user,
      userId: user.id,
      token,
      expirationDate: expiresAt,
    });

    await this.passwordResetTokenRepositoy.save(recovery);

    const recoveryLink = `http://localhost:3000/recovery-password?token=${token}`;

    await this.emailService.sendPasswordRecoveryEmail(user.email, recoveryLink);
  }

  async changePassword(dto: RecoveryChangePasswordDto): Promise<void> {
    const recovery = await this.passwordResetTokenRepositoy.findOne({
      where: { token: dto.token },
      relations: ['user'],
    });

    if (!recovery || recovery.expirationDate < new Date()) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    recovery.user.password = hashedPassword;
    await this.userRepository.save(recovery.user);

    await this.passwordResetTokenRepositoy.delete({ id: recovery.id });
  }
}
