import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaxCategory } from '../../../common/enums/taxCategory.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusInstaller } from 'src/common/enums/status-installer';

export class CreateInstallerDto {
  @ApiProperty({
    description: 'Identificación única del usuario',
    example: '54nj32kn54325432knjknk7l654',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    enum: TaxCategory,
    description: 'Categoria fiscal del usuario',
    example: TaxCategory.Monotributist,
  })
  @IsEnum(TaxCategory)
  taxCondition: TaxCategory;

  @ApiPropertyOptional({
    description:
      'Cualquier consulta o comentario adicional proporcionado por el usuario.',
    type: String,
    example: 'Consulta sobre disponibilidad de servicios.',
  })
  @IsOptional()
  @IsString()
  queries?: string;

  @ApiProperty({
    description: 'Indica si el usuario tiene seguro de accidentes personales.',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  hasPersonalAccidentInsurance: boolean;

  @ApiProperty({
    description:
      'Indica si el usuario puede trabajar en altura de forma segura.',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  canWorkAtHeight: boolean;

  @ApiProperty({
    description: 'Indica si el usuario puede tensar lonas frontal y trasera.',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  canTensionFrontAndBackLonas: boolean;

  @ApiProperty({
    description: 'Indica si el usuario puede instalar letreros corpóreos.',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  canInstallCorporealSigns: boolean;

  @ApiProperty({
    description: 'Indica si el usuario puede instalar vinilo esmerilado.',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  canInstallFrostedVinyl: boolean;

  @ApiProperty({
    description:
      'Indica si el usuario puede instalar vinilo en paredes o vidrios.',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  canInstallVinylOnWallsOrGlass: boolean;

  @ApiProperty({
    description:
      'Indica si el usuario puede realizar car wrapping (vinilado de autos).',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  canDoCarWrapping: boolean;

  @ApiProperty({
    description: 'Indica si el usuario cuenta con transporte propio.',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  hasOwnTransportation: boolean;

  @ApiProperty({
    description: 'Indica el estado del instalador',
    enum: StatusInstaller,
    example: 'En proceso, Aprobado, Rechazado',
  })
  @IsOptional()
  @IsEnum(StatusInstaller)
  status?: StatusInstaller;
}
