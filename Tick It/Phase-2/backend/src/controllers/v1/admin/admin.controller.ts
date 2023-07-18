import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { AdminService } from "../../../app-services/admin/admin.service";
import { AdminRequest } from "../../../dtos/request/admin.request";
import { AdminResponse } from "../../../dtos/response/admin.response";
import { Exception } from "@tsed/exceptions";

@Controller("/admins")
@Tags('Admin')
export class AdminController {

    @Inject(AdminService)
    protected service: AdminService;

    @Get("/")
    @Returns(200, Array).Of(AdminResponse)
    public async getAdmins(@QueryParams("filter") filter?: string): Promise<AdminResponse[]> {
        try {
            return filter ? await this.service.getAdmins(JSON.parse(filter)) : await this.service.getAdmins();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Returns(200, AdminResponse)
    public async createAdmin(@BodyParams() payload: AdminRequest): Promise<AdminResponse> {
        try {
            return await this.service.createAdmin(payload);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Returns(200, AdminResponse)
    public async updateAdmin(@PathParams("id") id: string, @BodyParams() payload: AdminRequest): Promise<AdminResponse> {
        try {
            return await this.service.updateAdmin(id, payload);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Returns(200, Boolean)
    public async removeAdmin(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeAdmin(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}