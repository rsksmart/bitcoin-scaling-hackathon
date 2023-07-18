import { Inject, Service } from "@tsed/di";
import { EventTicketTypeRequest } from "../../dtos/request/event-ticket-type.request";
import { EventTicketTypeResponse } from "../../dtos/response/event-ticket-type.response";
import { EVENT_TICKET_TYPE_REPOSITORY } from "../../repositories/event-ticket-type/event-ticket-type.repository";
import { NotFound } from "@tsed/exceptions";

@Service()
export class EventTicketTypeService {
  @Inject(EVENT_TICKET_TYPE_REPOSITORY)
  protected repository: EVENT_TICKET_TYPE_REPOSITORY;

  /**
   * @method getEventTicketTypes
   * @param filter
   * @returns Promise<EventTicketTypeResponse[]>
   * @example
   *  const eventTicketTypes = await getEventTicketTypes({
   *    where: {name: "VIP"},
   *    relations: ["event"]
   *  })
   */
  public async getEventTicketTypes(filter?: any): Promise<Array<EventTicketTypeResponse>> {
    const eventTicketTypes = filter
      ? await this.repository.find(filter)
      : await this.repository.find();
    if (!eventTicketTypes) return [];
    return eventTicketTypes;
  }

  /**
   * @method createEventTicketType
   * @param payload EventTicketTypeRequest
   * @returns Promise<EventTicketTypeResponse>
   * @example
   *  const eventTicketType = await createEventTicketType({
   *      name: "Regular",
   *      ...
   *  })
   */
  public async createEventTicketType(
    payload: EventTicketTypeRequest,
  ): Promise<EventTicketTypeResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.repository.save({ ...payload });
  }

  /**
   * @method createEventTicketBatch
   * @param payload EventTicketTypeRequest[]
   * @returns Promise<EventTicketTypeResponse>
   * @example
   *  const eventTicketTypes = await createEventTicketBatch([
   *    {name: "Regular", ...},
   *    {name: "VVIP",...}
   * ])
   */
  public createEventTicketBatch(
    payload: EventTicketTypeRequest[],
  ): Promise<EventTicketTypeResponse>[] {
    const res = payload.map(async (ticketType) => await this.createEventTicketType(ticketType));
    return res;
  }

  /**
   * @method updateEventTicketType
   * @param id string
   * @param payload EventTicketTypeRequest
   * @returns Promise<EventTicketTypeResponse>
   * @example
   *  const eventTicketType = await updateEventTicketType("d0de0c5f-afc0-4980-9016-e6420a36036e", {
   *      supply: "1000"
   *  })
   */
  public async updateEventTicketType(
    id: string,
    payload: EventTicketTypeRequest,
  ): Promise<EventTicketTypeResponse> {
    id = id.toLowerCase();
    await this.repository.update({ id: id }, { ...payload });

    const eventTicketType = await this.repository.findOne({ where: { id: id } });
    if (!eventTicketType) throw new NotFound("EventTicketType not found");

    return eventTicketType;
  }

  /**
   * @method removeEventTicketType
   * @param id string
   * @returns Promise<boolean>
   * @example
   *  const eventTicketType = await removeEventTicketType("d0de0c5f-afc0-4980-9016-e6420a36036e")
   */
  public async removeEventTicketType(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const eventTicketType = await this.repository.findOne({ where: { id: id } });
    if (!eventTicketType) throw new NotFound("EventTicketType not found");

    await this.repository.remove(eventTicketType);
    return true;
  }
}
