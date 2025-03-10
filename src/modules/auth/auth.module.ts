import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { JwtModule } from "@nestjs/jwt";
import { InstallerModule } from "../installer/installer.module";
import { InstallerService } from "../installer/installer.service";
import { Installer } from "../installer/entities/installer.entity";
import { Role } from "../user/entities/roles.entity";
import { Coordinator } from "../coordinators/entities/coordinator.entity";
import { CoordinatorsModule } from "../coordinators/coordinators.module";

@Module({
    imports: [TypeOrmModule.forFeature([User, Installer, Role, Coordinator]),
    UserModule,
    InstallerModule,
    CoordinatorsModule,
    JwtModule.register({
        signOptions: { expiresIn: '1h' },
        secret: process.env.JWT_SECRET,
      }),
],
    providers: [AuthService, UserService, InstallerService],
    controllers: [AuthController],
})

export class AuthModule{}