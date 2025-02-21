import { Injectable } from '@nestjs/common';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';

@Injectable()
export class CoordinatorsService {
  create(createCoordinatorDto: CreateCoordinatorDto) {
    return 'This action adds a new coordinator';
  }

  findAll() {
    return `This action returns all coordinators`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coordinator`;
  }

  update(id: number, updateCoordinatorDto: UpdateCoordinatorDto) {
    return `This action updates a #${id} coordinator`;
  }

  remove(id: number) {
    return `This action removes a #${id} coordinator`;
  }
}
