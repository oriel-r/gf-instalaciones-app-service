import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "../user-role/entities/user-role.entity";
import { Repository } from "typeorm";
import { Role } from "../user/entities/roles.entity";
import { UserService } from "../user/user.service";
import { OnEvent } from "@nestjs/event-emitter";
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

  @OnEvent('verifyRole.coordinator')
  async handleVerifyCoordinatorRole(id: string): Promise<UserRole | false> {
    const role = await this.userRoleRepository.findOne({
      where: {id: id, role:{name: RoleEnum.COORDINATOR }},
      relations: {role: true}
    });
    return role || false;
  }

  @OnEvent('verifyRole.client')
  async handleVerifyClientRole(id: string): Promise<UserRole | false> {
    const role = await this.userRoleRepository.findOne({
      where: {id: id, role:{name: RoleEnum.USER}},
      relations: {role: true}
    });

    return role || false;
  }
}
