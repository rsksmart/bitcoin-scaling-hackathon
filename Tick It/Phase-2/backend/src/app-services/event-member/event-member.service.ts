import { Inject, Service } from "@tsed/di";
import { EventMemberRequest } from "../../dtos/request/event-member.request";
import { EventMemberResponse } from "../../dtos/response/event-member.response";
import { EVENT_MEMBER_REPOSITORY } from "../../repositories/event-member/event-member.repository";
import { NotFound } from "@tsed/exceptions";

@Service()
export class EventMemberService {
  @Inject(EVENT_MEMBER_REPOSITORY)
  protected repository: EVENT_MEMBER_REPOSITORY;

  /**
   * @method getEventMembers
   * @param filter
   * @returns Promise<EventMemberResponse[]>
   * @example
   *  const eventMembers = await getEventMembers({
   *    where: {id: "d0de0c5f-afc0-4980-9016-e6420a36036e"}
   *    relations: ["event"]
   *  })
   */
  public async getEventMembers(filter?: any): Promise<Array<EventMemberResponse>> {
    const eventMembers = filter ? await this.repository.find(filter) : await this.repository.find();
    if (!eventMembers) return [];
    return eventMembers;
  }

  /**
   * @method createEventMember
   * @param payload EventMemberRequest
   * @returns Promise<EventMemberResponse>
   * @example
   *  const eventMember = await createEventMember({
   *      memberId: "d0de0c5f-afc0-4980-9016-e6420a36036e",
   *      ...
   *  })
   */
  public async createEventMember(payload: EventMemberRequest): Promise<EventMemberResponse> {
    if (payload.id) payload.id = String(payload.id).toLowerCase();
    return await this.repository.save({ ...payload });
  }

  /**
   * @method updateEventMember
   * @param id string
   * @param payload EventMemberRequest
   * @returns Promise<EventMemberResponse>
   * @example
   *  const eventMember = await updateEventMember("d0de0c5f-afc0-4980-9016-e6420a36036e", {
   *      eventId: "d0de0c5f-afc0-4980-9016-e6420a36036e"
   *  })
   */
  public async updateEventMember(
    id: string,
    payload: EventMemberRequest,
  ): Promise<EventMemberResponse> {
    id = id.toLowerCase();
    await this.repository.update({ id: id }, { ...payload });

    const eventMember = await this.repository.findOne({ where: { id: id } });
    if (!eventMember) throw new NotFound("EventMember not found");

    return eventMember;
  }

  /**
   * @method removeEventMember
   * @param id string
   * @returns Promise<boolean>
   * @example
   *  const eventMember = await removeEventMember("d0de0c5f-afc0-4980-9016-e6420a36036e")
   */
  public async removeEventMember(id: string): Promise<boolean> {
    id = id.toLowerCase();
    const eventMember = await this.repository.findOne({ where: { id: id } });
    if (!eventMember) throw new NotFound("EventMember not found");

    await this.repository.remove(eventMember);
    return true;
  }
}
