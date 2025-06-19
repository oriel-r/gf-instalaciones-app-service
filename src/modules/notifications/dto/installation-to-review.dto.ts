import { IsNotEmpty } from 'class-validator';
import { InstallationPostponedDto } from './installation-postponed.dto';
import { Address } from 'src/modules/locations/address/entities/address.entity';
import { Installation } from 'src/modules/operations/installations/entities/installation.entity';

export class InstallationToReviewDto {
  @IsNotEmpty()
  coordinatorId: string[] | undefined;

  address: Address | null;

  @IsNotEmpty()
  clientId: string[] | undefined;

  @IsNotEmpty()
  images: string[] | null;

  constructor({
    coordinator,
    address,
    images,
    order: { client },
  }: Installation) {
    this.clientId = client?.map((client) => client.id);
    this.coordinatorId = coordinator?.map((coordinator) => coordinator.id);
    this.address = address;
    this.images = images;
  }
}
