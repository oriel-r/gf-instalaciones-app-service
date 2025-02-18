import { ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InstallerService } from '../installer/installer.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => InstallerService))
    private readonly installerService: InstallerService
  ) {}

  async createUser( createUserDto: CreateUserDto ) {
    const {email, identificationNumber} = createUserDto;
    
    const userExisting = await this.findByEmail(email);
    
    if (userExisting) {
      const installer = await this.installerService.findByEmail(userExisting.email);
    
      if (installer) {
        throw new ConflictException('El email ya está registrado como instalador');
      }
      
      throw new ConflictException('Email existente');
    }

    const existingNumber = await this.userRepository.findOne({where: {identificationNumber}})
    if(existingNumber) throw new ConflictException('El documento de identidad ya se encuentra registrado, usersService');

    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    const { password, ...result } = newUser;
    return result;
  }

  async findAll() {
    return await this.userRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
      return await this.userRepository.findOne({where: {email}});
  }
}
