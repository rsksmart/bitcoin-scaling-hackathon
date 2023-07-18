import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { EventTicketTypeService } from "../../../app-services/event-ticket-type/event-ticket-type.service";
import { EventTicketTypeRequest } from "../../../dtos/request/event-ticket-type.request";
import { EventTicketTypeResponse } from "../../../dtos/response/event-ticket-type.response";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";

@Controller("/eventTicketTypes")
@Tags('EventTicketType')
export class EventTicketTypeController {

    @Inject(EventTicketTypeService)
    protected service: EventTicketTypeService;

    @Get("/")
    @Returns(200, Array).Of(EventTicketTypeResponse)
    public async getEventTicketTypes(@QueryParams("filter") filter?: string): Promise<EventTicketTypeResponse[]> {
        try {
            return filter ? await this.service.getEventTicketTypes(JSON.parse(filter)) : await this.service.getEventTicketTypes();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/batch")
    @Authenticate("jwt-passport")
    @Returns(200, EventTicketTypeResponse)
    public createEventTicketBatch(@BodyParams() payload: EventTicketTypeRequest[]): Promise<EventTicketTypeResponse>[] {
        try {
            return this.service.createEventTicketBatch(payload);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Authenticate("jwt-passport")
    @Returns(200, EventTicketTypeResponse)
    public async createEventTicketType(@BodyParams() payload: EventTicketTypeRequest): Promise<EventTicketTypeResponse> {
        try {
            return await this.service.createEventTicketType(payload);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, EventTicketTypeResponse)
    public async updateEventTicketType(@PathParams("id") id: string, @BodyParams() payload: EventTicketTypeRequest): Promise<EventTicketTypeResponse> {
        try {
            return await this.service.updateEventTicketType(id, payload);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, Boolean)
    public async removeEventTicketType(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeEventTicketType(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}