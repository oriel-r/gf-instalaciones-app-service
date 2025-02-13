import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Repository } from "typeorm";

@Injectable() 
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepositoy: Repository<User>,
        private readonly userService: UserService
    ) {}

    
}