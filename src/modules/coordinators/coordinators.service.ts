import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Coordinator } from './entities/coordinator.entity';
import { Admin, QueryRunner, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@ApiTags('Coordinators')
@Injectable()
export class CoordinatorsService {
  constructor(
    @InjectRepository(Coordinator)
    private readonly coordinatorRepository: Repository<Coordinator>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createCoordinatorTransactional(
    userId: string,
    queryRunner: QueryRunner,
  ): Promise<Coordinator> {
    console.log('🧪 createCoordinatorTransactional > userId:', userId);
    const user = await queryRunner.manager.findOne(User, {
      where: { id: userId },
      relations: ['coordinator'],
    });

    if (!user) {
      console.error('❌ Usuario no encontrado para userId:', userId);
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.coordinator) throw new ConflictException('Ya es coordinador');

    const newCoordinator = queryRunner.manager.create(Coordinator, { user });
    const cordinator = await queryRunner.manager.save(
      Coordinator,
      newCoordinator,
    );

    console.log('✅ Coordinador creado:', cordinator);
    return cordinator;
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

  async delete(userId: string) {
    const coordinator = await this.coordinatorRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!coordinator) {
      throw new NotFoundException('Coordinador no encontrado');
    }

    await this.coordinatorRepository.remove(coordinator);
    return { message: 'Coordinador eliminado correctamente.' };
  }

  async findById(id: string) {
    const coordinator = await this.coordinatorRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!coordinator) {
      throw new NotFoundException('Coordinador no encontrado');
    }
    return coordinator;
  }

  async getAll() {
    return await this.coordinatorRepository.find({
      relations: ['user'],
    });
  }
}
