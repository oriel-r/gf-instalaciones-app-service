import {
  BadRequestException,
  ConflictException,
  Delete,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InstallerService } from '../installer/installer.service';
import { IsNull, Not, Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => InstallerService))
    private readonly installerService: InstallerService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, identificationNumber } = createUserDto;

    const userExisting = await this.findByEmail(email);

    if (userExisting) {
      const installer = await this.installerService.findByEmail(
        userExisting.email,
      );

      if (installer) {
        throw new ConflictException(
          'El email ya está registrado como instalador',
        );
      }

      throw new ConflictException('Email existente');
    }

    const existingNumber = await this.userRepository.findOne({
      where: { identificationNumber },
    });
    if (existingNumber)
      throw new ConflictException(
        'El documento de identidad ya se encuentra registrado, usersService',
      );

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
    });

    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async softDelete(id: string) {
    await this.userRepository.softDelete(id);
    return { message: 'Se desactivo correctamente' };
  }

  async restore(id: string) {
    const user = await this.findDisabledUserById(id);
    if (user && user.disabledAt !== null) {
      await this.userRepository.restore(id);
      return { message: 'Se restauro correctamente' };
    }
    throw new BadRequestException('El usuario indicado ya se encuentra activo');
  }

  async findAllWhitDeleted() {
    return await this.userRepository.find({ withDeleted: true });
  }

  async findDisabledUserById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId, disabledAt: Not(IsNull()) },
      withDeleted: true,
    });
  
    if (!user) {
      throw new NotFoundException('Usuario desactivado no encontrado');
    }
  
    return user;
  } 
  
}
