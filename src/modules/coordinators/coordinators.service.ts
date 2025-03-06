import { Injectable } from '@nestjs/common';
import { UpdateCoordinatorDto } from './dto/update-coordinator.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateCoordinatorDto } from './dto/create-coordinator.dto';

@ApiTags('Coordinators')
@Injectable()
export class CoordinatorsService {
  constructor() {}

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
