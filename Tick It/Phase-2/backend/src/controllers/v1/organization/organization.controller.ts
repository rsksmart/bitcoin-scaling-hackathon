import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { OrganizationService } from "../../../app-services/organization/organization.service";
import { OrganizationRequest } from "../../../dtos/request/organization.request";
import { OrganizationResponse } from "../../../dtos/response/organization.response";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";

@Controller("/organizations")
@Tags('Organization')
export class OrganizationController {

    @Inject(OrganizationService)
    protected service: OrganizationService;

    @Get("/")
    @Returns(200, Array).Of(OrganizationResponse)
    public async getOrganizations(@QueryParams("filter") filter?: string): Promise<OrganizationResponse[]> {
        try {
            return filter ? await this.service.getOrganizations(JSON.parse(filter)) : await this.service.getOrganizations();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Authenticate("jwt-passport")
    @Returns(200, OrganizationResponse)
    public async createOrganization(@BodyParams() organization: OrganizationRequest): Promise<OrganizationResponse> {
        try {
            return await this.service.createOrganization(organization);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, OrganizationResponse)
    public async updateOrganization(@PathParams("id") id: string, @BodyParams() organization: OrganizationRequest): Promise<OrganizationResponse> {
        try {
            return await this.service.updateOrganization(id, organization);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, Boolean)
    public async removeOrganization(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeOrganization(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}