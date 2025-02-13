import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser( createUserDto: CreateUserDto ) {
    const user = await this.findByEmail(createUserDto.email);
    
    if(!user) throw new NotFoundException('No se encontro un usuario con el email indicado');

    if(user.identificationNumber) throw new ConflictException('El documento de identidad ya se encuentra registrado');

    const newUser = new User()
    newUser.name =d
  }

  findAll() {
    return `This action returns all user`;
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
      return await this.userRepository.findOne({where: {email}})
  }
}
