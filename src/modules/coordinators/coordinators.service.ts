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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SyncWithSheetsEnum } from 'src/common/enums/sync-with-sheets-event.enum';

@ApiTags('Coordinators')
@Injectable()
export class CoordinatorsService {
  constructor(
    @InjectRepository(Coordinator)
    private readonly coordinatorRepository: Repository<Coordinator>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly eventEmiiter: EventEmitter2,
  ) {}

  async createCoordinatorTransactional(
    userId: string,
    queryRunner: QueryRunner,
  ): Promise<Coordinator> {
    const user = await queryRunner.manager.findOne(User, {
      where: { id: userId },
      relations: ['coordinator'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.coordinator) throw new ConflictException('Ya es coordinador');

    const newCoordinator = queryRunner.manager.create(Coordinator, { user });
    const cordinator = await queryRunner.manager.save(
      Coordinator,
      newCoordinator,
    );

    await this.eventEmiiter.emitAsync(SyncWithSheetsEnum.APPEND_ROW, {
      sheet: 'COORDINADORES',
      values: [user.fullName, user.email],
    });

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

  async disable(id: string) {
    const coordinator = await this.findById(id);
    if (coordinator.disabledAt) {
      throw new BadRequestException('Este coordinador ya está deshabilitado');
    }

    coordinator.disabledAt = new Date();
    await this.coordinatorRepository.save(coordinator);
    return { message: 'Coordinador desactivado correctamente' };
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
