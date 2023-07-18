import { Inject, Service } from "@tsed/di";
import { AdminRequest } from "../../dtos/request/admin.request";
import { AdminResponse } from "../../dtos/response/admin.response";
import { ADMIN_REPOSITORY } from "../../repositories/admin/admin.repository";
import { NotFound } from "@tsed/exceptions";

@Service()
export class AdminService {
  @Inject(ADMIN_REPOSITORY)
  protected repository: ADMIN_REPOSITORY;

  /**
   * @method getAdmins
   * @param filter
   * @returns Promise<AdminResponse[]>
   * @example
   *  const admins = await getAdmins({
   *    where: {name: "john", relations: ["adminRole"]}
   *  })
   */
  public async getAdmins(filter?: any): Promise<Array<AdminResponse>> {
    const admins = filter ? await this.repository.find(filter) : await this.repository.find();
    if (!admins) return [];
    return admins;
  }

  /**
   * @method createAdmin
   * @param payload AdminRequest
   * @returns Promise<AdminResponse>
   * @example
   *  const admin = await createAdmin({
   *      name: "john",
          adminRoleId: "d0de0c5f-afc0-4980-9016-e6420a36036e",
          email: "john@example.com"
   *  })
   */
  public async createAdmin(payload: AdminRequest): Promise<AdminResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.repository.save({ ...payload });
  }

  /**
   * @method updateAdmin
   * @param id string
   * @param payload AdminRequest
   * @returns Promise<AdminResponse>
   * @example
   *  const admin = await updateAdmin("d0de0c5f-afc0-4980-9016-e6420a36036e", {
   *      name: "jane",
          address: "Lebanon"
   *  })
   */
  public async updateAdmin(id: string, payload: AdminRequest): Promise<AdminResponse> {
    id = id.toLowerCase();
    await this.repository.update({ id: id }, { ...payload });

    const admin = await this.repository.findOne({ where: { id: id } });
    if (!admin) throw new NotFound("Admin not found");

    return admin;
  }

  /**
   * @method removeAdmin
   * @param id string
   * @returns Promise<boolean>
   * @example
   *  const admin = await removeAdmin("d0de0c5f-afc0-4980-9016-e6420a36036e")
   */
  public async removeAdmin(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const admin = await this.repository.findOne({ where: { id: id } });
    if (!admin) throw new NotFound("Admin not found");

    await this.repository.remove(admin);
    return true;
  }
}
