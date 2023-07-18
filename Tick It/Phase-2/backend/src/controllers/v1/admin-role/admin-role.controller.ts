import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { AdminRoleService } from "../../../app-services/admin-role/admin-role.service";
import { AdminRoleRequest } from "../../../dtos/request/admin-role.request";
import { AdminRoleResponse } from "../../../dtos/response/admin-role.response";
import { Exception } from "@tsed/exceptions";

@Controller("/adminRoles")
@Tags('AdminRole')
export class AdminRoleController {

    @Inject(AdminRoleService)
    protected service: AdminRoleService;

    @Get("/")
    @Returns(200, Array).Of(AdminRoleResponse)
    public async getAdminRoles(@QueryParams("filter") filter?: string): Promise<AdminRoleResponse[]> {
        try {
            return filter ? await this.service.getAdminRoles(JSON.parse(filter)) : await this.service.getAdminRoles();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Returns(200, AdminRoleResponse)
    public async createAdminRole(@BodyParams() payload: AdminRoleRequest): Promise<AdminRoleResponse> {
        try {
            return await this.service.createAdminRole(payload);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Returns(200, AdminRoleResponse)
    public async updateAdminRole(@PathParams("id") id: string, @BodyParams() payload: AdminRoleRequest): Promise<AdminRoleResponse> {
        try {
            return await this.service.updateAdminRole(id, payload);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Returns(200, Boolean)
    public async removeAdminRole(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeAdminRole(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}