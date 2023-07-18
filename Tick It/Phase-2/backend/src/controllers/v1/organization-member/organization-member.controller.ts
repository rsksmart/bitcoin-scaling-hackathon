import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { OrganizationMemberService } from "../../../app-services/organization-member/organization-member.service";
import { OrganizationMemberRequest } from "../../../dtos/request/organization-member.request";
import { OrganizationMemberResponse } from "../../../dtos/response/organization-member.response";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";

@Controller("/organizationMembers")
@Tags('OrganizationMember')
export class OrganizationMemberController {

    @Inject(OrganizationMemberService)
    protected service: OrganizationMemberService;

    @Get("/")
    @Returns(200, Array).Of(OrganizationMemberResponse)
    public async getOrganizationMembers(@QueryParams("filter") filter?: string): Promise<OrganizationMemberResponse[]> {
        try {
            return filter ? await this.service.getOrganizationMembers(JSON.parse(filter)) : await this.service.getOrganizationMembers();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Authenticate("jwt-passport")
    @Returns(200, OrganizationMemberResponse)
    public async createOrganizationMember(@BodyParams() organizationMember: OrganizationMemberRequest): Promise<OrganizationMemberResponse> {
        try {
            return await this.service.createOrganizationMember(organizationMember);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, OrganizationMemberResponse)
    public async updateOrganizationMember(@PathParams("id") id: string, @BodyParams() organizationMember: OrganizationMemberRequest): Promise<OrganizationMemberResponse> {
        try {
            return await this.service.updateOrganizationMember(id, organizationMember);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, Boolean)
    public async removeOrganizationMember(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeOrganizationMember(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}