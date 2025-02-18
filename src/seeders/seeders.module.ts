import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { User } from "src/modules/user/entities/user.entity";
import { UserSeeds } from "./users/user.seeds";

@Module({
    imports:[TypeOrmModule.forFeature([User]),
    JwtModule,
],
    providers: [UserSeeds],
    exports: [UserSeeds],
})

export class SeedersModule {}
