import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { EventService } from "../../../app-services/event/event.service";
import { EventRequest } from "../../../dtos/request/event.request";
import { EventResponse } from "../../../dtos/response/event.response";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";

@Controller("/events")
@Tags("Event")
export class EventController {
  @Inject(EventService)
  protected service: EventService;

  @Get("/")
  @Returns(200, Array).Of(EventResponse)
  public async getEvents(@QueryParams("filter") filter?: string): Promise<EventResponse[]> {
    try {
      return filter
        ? await this.service.getEvents(JSON.parse(filter))
        : await this.service.getEvents();
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Get("/filtered")
  @Returns(200, Array).Of(EventResponse)
  public async getFilteredEvents(
    @QueryParams("categoryIds") categoryIds?: string,
    @QueryParams("location") location?: string,
    @QueryParams("search") search?: string,
    @QueryParams("from") from?: Date,
    @QueryParams("to") to?: Date,
  ): Promise<EventResponse[]> {
    try {
      return await this.service.getFilteredEvents(categoryIds, location, search, from, to);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Get("/search")
  @Returns(200, Array).Of(EventResponse)
  public async searchEvents(@QueryParams("search") search: string): Promise<EventResponse[]> {
    try {
      return await this.service.searchEvents(search);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Post("/")
  @Authenticate("jwt-passport")
  @Returns(200, EventResponse)
  public async createEvent(@BodyParams() event: EventRequest): Promise<EventResponse> {
    try {
      return await this.service.createEvent(event);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Put("/:id")
  @Authenticate("jwt-passport")
  @Returns(200, EventResponse)
  public async updateEvent(
    @PathParams("id") id: string,
    @BodyParams() event: EventRequest,
  ): Promise<EventResponse> {
    try {
      return await this.service.updateEvent(id, event);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Delete("/:id")
  @Authenticate("jwt-passport")
  @Returns(200, Boolean)
  public async removeEvent(@PathParams("id") id: string): Promise<boolean> {
    try {
      return await this.service.removeEvent(id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}
