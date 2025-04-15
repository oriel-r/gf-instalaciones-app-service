import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Coordinator } from './entities/coordinator.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@ApiTags('Coordinators')
@Injectable()
export class CoordinatorsService {
  constructor(
    @InjectRepository(Coordinator)
    private readonly coordinatorRepository: Repository<Coordinator>,
    @InjectRepository(User)
        private readonly userRepository: Repository<User>,
  ) {}

  async createCoordinator(userId: string): Promise<Coordinator> {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['admin'],
      });
  
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
  
      if (user.coordinator) {
        throw new ConflictException('Este usuario ya es administrador');
      }
  
      const newCoordinator = this.coordinatorRepository.create({ user });
      return await this.coordinatorRepository.save(newCoordinator);
    }

  async disable(id: string): Promise<void> {
    const coordinator = await this.findById(id);
    if (coordinator.disabledAt) {
      throw new BadRequestException('Este coordinador ya está deshabilitado');
    }
  
    coordinator.disabledAt = new Date();
    await this.coordinatorRepository.save(coordinator);
  }
  
  async restore(id: string): Promise<void> {
    const coordinator = await this.findById(id);
    if (!coordinator.disabledAt) {
      throw new BadRequestException('Este coordinador ya está activo');
    }
  
    coordinator.disabledAt = null;
    await this.coordinatorRepository.save(coordinator);
  }

  update(id: number, updateCoordinatorDto: UpdateCoordinatorDto) {
    return `This action updates a #${id} coordinator`;
  }

  remove(id: number) {
    return `This action removes a #${id} coordinator`;
  }

  async findById(id: string) {
    const coordinator = await this.coordinatorRepository.findOne({
      where: { id },
    });
    if (!coordinator) throw new NotFoundException('Coordinador no encontrado');
    return coordinator;
  }
}
