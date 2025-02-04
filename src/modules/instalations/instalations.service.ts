import { Injectable } from '@nestjs/common';
import { CreateInstalationDto } from './dto/create-instalation.dto';
import { UpdateInstalationDto } from './dto/update-instalation.dto';

@Injectable()
export class InstalationsService {
  create(createInstalationDto: CreateInstalationDto) {
    return 'This action adds a new instalation';
  }

  findAll() {
    return `This action returns all instalations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} instalation`;
  }

  update(id: number, updateInstalationDto: UpdateInstalationDto) {
    return `This action updates a #${id} instalation`;
  }

  remove(id: number) {
    return `This action removes a #${id} instalation`;
  }
}
