import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../user/entities/roles.entity';

@ApiTags('Admin')
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  
  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

  async assignCoordinator(coordinatorId: string) {
    const user = await this.userService.findById(coordinatorId);
  
    const role = await this.roleRepository.findOne({ where: { name: 'Coordinador' } });
    if (!role) {
      throw new HttpException('Rol no encontrado', HttpStatus.NOT_FOUND);
    }
  
    user.role = role;
    await this.userRepository.save(user);
  
    return user;
  }
  
}
