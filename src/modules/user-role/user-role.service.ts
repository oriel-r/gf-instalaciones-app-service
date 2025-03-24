import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "../user-role/entities/user-role.entity";
import { Repository } from "typeorm";
import { Role } from "../user/entities/roles.entity";
import { UserService } from "../user/user.service";

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

  async assignRole(userId: string, roleName: string) {
    const user = await this.userService.findById(userId);

    let role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role) {
        role = this.roleRepository.create({
            name: roleName,
          });
          role = await this.roleRepository.save(role);
    }

    const userRole = this.userRoleRepository.create({
      user:user, 
      role:role,
    });
    return this.userRoleRepository.save(userRole);
  }

  async findUserRoleById(userId: string) {
    return await this.userRoleRepository.findOne({
      where: { user: { id: userId } },
      relations: ['role'], 
    });
  }
}
