import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt } from 'class-validator';
import { Sort } from '../enums/sort.dto';

export class BaseQueryOptions {
  @IsOptional()
  @IsString({message: 'Has enviado un texto invalido'})
  createdAt: Sort | undefined = undefined;

  @IsOptional()
  @IsString({message: 'Has enviado un texto invalido'})
  updatedAt: Sort | undefined = undefined;

  @IsOptional()
  @Type(() => Number)
  @IsInt({message: 'El número enviado no es un entero'})
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({message: 'El número enviado no es un entero'})
  limit: number;
}
