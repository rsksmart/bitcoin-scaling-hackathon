import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { EventMemberService } from "../../../app-services/event-member/event-member.service";
import { EventMemberRequest } from "../../../dtos/request/event-member.request";
import { EventMemberResponse } from "../../../dtos/response/event-member.response";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";

@Controller("/eventMembers")
@Tags('EventMember')
export class EventMemberController {

    @Inject(EventMemberService)
    protected service: EventMemberService;

    @Get("/")
    @Returns(200, Array).Of(EventMemberResponse)
    public async getEventMembers(@QueryParams("filter") filter?: string): Promise<EventMemberResponse[]> {
        try {
            return filter ? await this.service.getEventMembers(JSON.parse(filter)) : await this.service.getEventMembers();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Authenticate("jwt-passport")
    @Returns(200, EventMemberResponse)
    public async createEventMember(@BodyParams() eventMember: EventMemberRequest): Promise<EventMemberResponse> {
        try {
            return await this.service.createEventMember(eventMember);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, EventMemberResponse)
    public async updateEventMember(@PathParams("id") id: string, @BodyParams() eventMember: EventMemberRequest): Promise<EventMemberResponse> {
        try {
            return await this.service.updateEventMember(id, eventMember);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, Boolean)
    public async removeEventMember(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeEventMember(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}