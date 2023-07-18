import { Property } from "@tsed/schema";

export class EventTicketTypeRequest {
  @Property()
  id?: string;

  @Property()
  eventId: string;

  @Property()
  name: string;

  @Property()
  description?: string;

  @Property()
  supply: number;

  @Property()
  ticketTypeId?: number;

  @Property()
  price: string;

  @Property()
  image?: string;

  @Property()
  isSoldout: boolean;

  @Property()
  isActive: boolean;

  @Property()
  createdBy?: string;

  @Property()
  updatedby?: string;
}
