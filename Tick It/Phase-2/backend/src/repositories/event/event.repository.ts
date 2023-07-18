import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { Event } from "../../models/event";

export const EventRepository = PostgresDataSource.getRepository(Event);

export const EVENT_REPOSITORY = Symbol.for("EventRepository");
export type EVENT_REPOSITORY = typeof EventRepository;

registerProvider({
    provide: EVENT_REPOSITORY,
    useValue: EventRepository
});