import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { EventTicketType } from "../../models/event-ticket-type";

export const EventTicketTypeRepository = PostgresDataSource.getRepository(EventTicketType);

export const EVENT_TICKET_TYPE_REPOSITORY = Symbol.for("EventTicketTypeRepository");
export type EVENT_TICKET_TYPE_REPOSITORY = typeof EventTicketTypeRepository;

registerProvider({
    provide: EVENT_TICKET_TYPE_REPOSITORY,
    useValue: EventTicketTypeRepository
});