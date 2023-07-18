import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { MemberRoleService } from "../../../app-services/member-role/member-role.service";
import { MemberRoleRequest } from "../../../dtos/request/member-role.request";
import { MemberRoleResponse } from "../../../dtos/response/member-role.response";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";

@Controller("/memberRoles")
@Tags('MemberRole')
export class MemberRoleController {

    @Inject(MemberRoleService)
    protected service: MemberRoleService;

    @Get("/")
    @Returns(200, Array).Of(MemberRoleResponse)
    public async getMemberRoles(@QueryParams("filter") filter?: string): Promise<MemberRoleResponse[]> {
        try {
            return filter ? await this.service.getMemberRoles(JSON.parse(filter)) : await this.service.getMemberRoles();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Authenticate("jwt-passport")
    @Returns(200, MemberRoleResponse)
    public async createMemberRole(@BodyParams() membeRole: MemberRoleRequest): Promise<MemberRoleResponse> {
        try {
            return await this.service.createMemberRole(membeRole);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, MemberRoleResponse)
    public async updateMemberRole(@PathParams("id") id: string, @BodyParams() membeRole: MemberRoleRequest): Promise<MemberRoleResponse> {
        try {
            return await this.service.updateMemberRole(id, membeRole);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, Boolean)
    public async removeMemberRole(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeMemberRole(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}