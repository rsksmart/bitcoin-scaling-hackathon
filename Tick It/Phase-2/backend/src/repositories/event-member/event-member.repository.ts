import { registerProvider } from "@tsed/di";
import { EventMember } from "../../models/event-member";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";

export const EventMemberRepository = PostgresDataSource.getRepository(EventMember);

export const EVENT_MEMBER_REPOSITORY = Symbol.for("EventMemberRepository");
export type EVENT_MEMBER_REPOSITORY = typeof EventMemberRepository;

registerProvider({
    provide: EVENT_MEMBER_REPOSITORY,
    useValue: EventMemberRepository
});