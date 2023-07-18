import { Inject, Service } from "@tsed/di";
import { AdminRoleRequest } from "../../dtos/request/admin-role.request";
import { AdminRoleResponse } from "../../dtos/response/admin-role.response";
import { ADMIN_ROLE_REPOSITORY } from "../../repositories/admin-role/admin-role.repository";
import { NotFound } from "@tsed/exceptions";

@Service()
export class AdminRoleService {
  @Inject(ADMIN_ROLE_REPOSITORY)
  protected repository: ADMIN_ROLE_REPOSITORY;

  /**
   * @method getAdminRoles
   * @param filter
   * @returns Promise<AdminRoleResponse[]>
   * @example
   *  const adminRoles = await getAdminRoles({
   *    where: {roleName: "content-editor"}
   *  })
   */
  public async getAdminRoles(filter?: any): Promise<Array<AdminRoleResponse>> {
    const adminRoles = filter ? await this.repository.find(filter) : await this.repository.find();
    if (!adminRoles) return [];
    return adminRoles;
  }

  /**
   * @method createAdminRole
   * @param payload AdminRoleRequest
   * @returns Promise<AdminRoleResponse>
   * @example
   *  const adminRole = await createAdminRole({
   *      name: "super-admin"
   *  })
   */
  public async createAdminRole(payload: AdminRoleRequest): Promise<AdminRoleResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.repository.save({ ...payload });
  }

  /**
   * @method updateAdminRole
   * @param id string
   * @param payload AdminRoleRequest
   * @returns Promise<AdminRoleResponse>
   * @example
   *  const adminRole = await updateAdminRole("d0de0c5f-afc0-4980-9016-e6420a36036e", {
   *      roleName: "editor"
   *  })
   */
  public async updateAdminRole(id: string, payload: AdminRoleRequest): Promise<AdminRoleResponse> {
    id = id.toLowerCase();
    await this.repository.update({ id: id }, { ...payload });

    const adminRole = await this.repository.findOne({ where: { id: id } });
    if (!adminRole) throw new NotFound("AdminRole not found");

    return adminRole;
  }

  /**
   * @method removeAdminRole
   * @param id string
   * @returns Promise<boolean>
   * @example
   *  const adminRole = await removeAdminRole("d0de0c5f-afc0-4980-9016-e6420a36036e")
   */
  public async removeAdminRole(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const adminRole = await this.repository.findOne({ where: { id: id } });
    if (!adminRole) throw new NotFound("AdminRole not found");

    await this.repository.remove(adminRole);
    return true;
  }
}
