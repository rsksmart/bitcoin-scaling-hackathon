import { Property } from "@tsed/schema";
import { Event } from "../../models/event";
import { EventTicketType } from "../../models/event-ticket-type";
import { EventResponse } from "./event.response";

export class EventTicketTypeResponse implements EventTicketType {
  @Property()
  id: string;

  @Property()
  eventId: string;

  @Property(() => EventResponse)
  event: Event;

  @Property()
  name: string;

  @Property()
  description: string;

  @Property()
  supply: number;

  @Property()
  ticketTypeId: number;

  @Property()
  price: string;

  @Property()
  image: string;

  @Property()
  isSoldout: boolean;

  @Property()
  isActive: boolean;

  @Property()
  createdAt: Date;

  @Property()
  createdBy: string;

  @Property()
  updatedAt: Date;

  @Property()
  updatedBy: string;
}
