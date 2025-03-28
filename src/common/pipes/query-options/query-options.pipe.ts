import { validate, validateSync } from '@nestjs/class-validator';
import { ArgumentMetadata, BadRequestException, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Sort } from 'src/common/enums/sort.dto';

@Injectable()
export class QueryOptionsPipe <Dto extends object> implements PipeTransform {
  constructor(private readonly dto: new () => Dto) {}
  transform(value: any, metadata: ArgumentMetadata) {
   
    const object = plainToInstance(this.dto, value);

    if (object['page'] === undefined) {
      object['page'] = 1;
    }
    if (object['limit'] === undefined) {
      object['limit'] = 10;
    }
    if (object['createdAt'] === undefined) {
      object['createdAt'] = Sort.DSC;
    }
    if (object['updatedAt'] === undefined) {
      object['updatedAt'] = Sort.DSC;
    }
   
    const errors =  validateSync(object)
    
    if(errors.length > 0) {
      throw new HttpException(
        {message: 'Erros in queries', errors: {...errors}},
        HttpStatus.BAD_REQUEST,
      )
    }
    
    return object;
  }
}
