import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "../user-role/entities/user-role.entity";
import { Repository } from "typeorm";
import { Role } from "../user/entities/roles.entity";
import { UserService } from "../user/user.service";
import { RoleEnum } from "src/common/enums/user-role.enum";

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async assignRole(userId: string, roleId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
        throw new HttpException('Rol no encontrado', HttpStatus.NOT_FOUND);
    }

    const userRole = this.userRoleRepository.create({
        user, 
        role,
    });
    return this.userRoleRepository.save(userRole);
}

  async findUserRoleById(userId: string) {
    return await this.userRoleRepository.findOne({
      where: { user: { id: userId } },
      relations: ['role'], 
    });
  }

  async getByIdWhenRole (id: string, roleName: RoleEnum) {
    const role = await this.userRoleRepository.findOne({
      where: {id: id, role:{name: roleName}},
      relations: {role: true}
    });

    return role;
  }
}
