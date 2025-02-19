import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Installer } from './entities/installer.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ExtendedInstallerDto } from '../auth/dto/signup-installer.dto';

@Injectable()
export class InstallerService {
  constructor(
    @InjectRepository(Installer)
    private readonly installerRepository: Repository<Installer>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  //probar como trae los instalelrs
  async findAll() {
    return await this.installerRepository.find();
  }

  async createInstaller(createInstallerDto: ExtendedInstallerDto) {
    const { email, identificationNumber, password, ...installerData } = createInstallerDto;

    const user = await this.userService.findByEmail(email);

    if (user) {
        const existingInstaller = await this.installerRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['user'],
        });

        if (existingInstaller) {
            throw new ConflictException('El email ya está registrado como instalador');
        }
    } else {  
      const newUser = await this.userService.createUser({
            email,
            password,
            identificationNumber,
            ...installerData, 
        });

        return newUser;
    }

    const existingNumber = await this.installerRepository.findOne({
        where: { user: { identificationNumber } },
        relations: ['user'],
    });

    if (existingNumber) {
        throw new ConflictException('El documento de identidad ya se encuentra registrado');
    }

    const newInstaller = this.installerRepository.create({
        ...installerData,
        user: user ,
    });

    console.log(newInstaller)

    const installer = await this.installerRepository.save(newInstaller);
    return installer
}


  async findByEmail(email: string) {
    return await this.installerRepository.findOne({
      where: { user: { email } },
      relations: ['user'],
    });
  }
}
