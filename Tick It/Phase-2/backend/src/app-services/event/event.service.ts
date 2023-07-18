import { Inject, Service } from "@tsed/di";
import { EventRequest } from "../../dtos/request/event.request";
import { EventResponse } from "../../dtos/response/event.response";
import { EVENT_REPOSITORY } from "../../repositories/event/event.repository";
import { NotFound } from "@tsed/exceptions";
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
var slugify = require("slugify");

@Service()
export class EventService {
  @Inject(EVENT_REPOSITORY)
  protected repository: EVENT_REPOSITORY;

  /**
   * @method getEvents
   * @param filter
   * @returns Promise<EventResponse[]>
   * @example
   *  const events = await getEvents({
   *    where: {name: "The Jan Fest", contractAddress: "0x00"},
   *    relations: ["category"]
   *  })
   */
  public async getEvents(filter?: any): Promise<Array<EventResponse>> {
    const events = filter ? await this.repository.find(filter) : await this.repository.find();
    if (!events) return [];
    return events;
  }

  public async getFilteredEvents(
    categoryIds?: string,
    location?: string,
    search?: string,
    from?: Date,
    to?: Date,
  ): Promise<Array<EventResponse>> {
    let whereOptions: any[] = [];

    if (categoryIds) {
      let catIds = categoryIds.split(",");
      if (catIds?.length) catIds.map((categoryId) => whereOptions.push({ categoryId }));
    }

    if (!whereOptions?.length && (from || to || location || search)) whereOptions.push({});

    whereOptions.map((option, index) => {
      if (from && to) whereOptions[index].eventDate = Between(from, to);
      else if (from) whereOptions[index].eventDate = MoreThanOrEqual(from);
      else if (to) whereOptions[index].eventDate = LessThanOrEqual(to);

      if (location) whereOptions[index].location = ILike("%" + location + "%");
      if (search) whereOptions[index].name = ILike("%" + search + "%");
    });

    let filter: any = { relations: ["category", "organization"] };

    if (whereOptions?.length) filter.where = whereOptions;

    const events = await this.repository.find(filter);
    if (!events) return [];
    return events;
  }

  public async searchEvents(search: string): Promise<Array<EventResponse>> {
    const events = await this.repository.find({
      where: { name: ILike("%" + search + "%") },
    });
    if (!events) return [];
    return events;
  }

  /**
   * @method createEvent
   * @param payload EventRequest
   * @returns Promise<EventResponse>
   * @example
   *  const event = await createEvent({
   *      name: "Sunday Yoga",
   *      ...
   *  })
   */
  public async createEvent(payload: EventRequest): Promise<EventResponse> {
    payload.slug = slugify(payload.name, { lower: true });
    return await this.repository.save({ ...payload });
  }

  /**
   * @method updateEvent
   * @param id string
   * @param payload EventRequest
   * @returns Promise<EventResponse>
   * @example
   *  const event = await updateEvent("d0de0c5f-afc0-4980-9016-e6420a36036e", {
   *      description: "On jan 1 2028, we are hosting ..."
   *  })
   */
  public async updateEvent(id: string, payload: EventRequest): Promise<EventResponse> {
    await this.repository.update({ id: id }, { ...payload });

    const event = await this.repository.findOne({ where: { id: id } });
    if (!event) throw new Error("Failed to update record");

    return event;
  }

  /**
   * @method removeEvent
   * @param id string
   * @returns Promise<boolean>
   * @example
   *  const event = await removeEvent("d0de0c5f-afc0-4980-9016-e6420a36036e")
   */
  public async removeEvent(id: string): Promise<boolean> {
    const event = await this.repository.findOne({ where: { id: id } });
    if (!event) throw new NotFound("Event not found");

    await this.repository.remove(event);
    return true;
  }
}
