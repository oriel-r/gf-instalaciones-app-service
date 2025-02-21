import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('/findAllWhitDeleted')
  async findAllWhitDeleted() {
    return await this.userService.findAllWhitDeleted();
  }

  @Get('/findDisabledById/:id')
  async findDisabledUserById(userId: string) {
    return await this.userService.findDisabledUserById(userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('byEmail')
  async findByEmail(@Body('email') email: string) {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user)
        throw new NotFoundException(
          `No se encontro el usuario con el email: ${email}`,
        );
      return user;
    } catch (error) {
      throw new NotFoundException(`No se encontro el usuario`);
    }
  }

  @Delete('/disabled/:id')
  async softDelete(@Param('id') id: string) {
    return await this.userService.softDelete(id);
  }

  @Put('/restore/:id')
  async restore(@Param('id') id: string) {
    return await this.userService.restore(id);
  }
}
