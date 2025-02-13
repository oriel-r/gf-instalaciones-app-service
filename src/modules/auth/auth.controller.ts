import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "../user/dto/create-user.dto";

@Controller()
export class AuthController {
    constructor() {}

    @Post()
    async signUp (@Body() userDto: CreateUserDto) {
        
    }
}