import { Controller, Get, Post } from '@nestjs/common';
import { InstallerService } from './installer.service';

@Controller('installer')
export class InstallerController {
constructor(private readonly installerService: InstallerService) {}
    
    @Get()
      findAll() {
        return this.installerService.findAll();
    }
}
