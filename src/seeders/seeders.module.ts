import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { User } from "src/modules/user/entities/user.entity";
import { UserSeeds } from "./users/user.seeds";
import { Role } from "src/modules/user/entities/roles.entity";

@Module({
    imports:[TypeOrmModule.forFeature([User, Role]),
    JwtModule,
],
    providers: [UserSeeds],
    exports: [UserSeeds],
})

export class SeedersModule {}
