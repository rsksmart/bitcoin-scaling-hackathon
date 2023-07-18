import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { InvitationService } from "../../../app-services/invitation/invitation.service";
import { InvitationRequest } from "../../../dtos/request/invitation.request";
import { InvitationResponse } from "../../../dtos/response/invitation.response";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";

@Controller("/invitations")
@Tags('Invitation')
export class InvitationController {

    @Inject(InvitationService)
    protected service: InvitationService;

    @Get("/")
    @Returns(200, Array).Of(InvitationResponse)
    public async getInvitations(@QueryParams("filter") filter?: string): Promise<InvitationResponse[]> {
        try {
            return filter ? await this.service.getInvitations(JSON.parse(filter)) : await this.service.getInvitations();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Authenticate("jwt-passport")
    @Returns(200, InvitationResponse)
    public async createInvitation(@BodyParams() invitation: InvitationRequest): Promise<InvitationResponse> {
        try {
            return await this.service.createInvitation(invitation);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, InvitationResponse)
    public async updateInvitation(@PathParams("id") id: string, @BodyParams() invitation: InvitationRequest): Promise<InvitationResponse> {
        try {
            return await this.service.updateInvitation(id, invitation);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, Boolean)
    public async removeInvitation(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeInvitation(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}