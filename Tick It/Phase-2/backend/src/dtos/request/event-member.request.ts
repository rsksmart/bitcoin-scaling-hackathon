import { Property } from "@tsed/schema";

export class EventMemberRequest {
    @Property()
    id?: string;

    @Property()
    memberId: string;

    @Property()
    eventId: string;

    @Property()
    createdBy?: string

    @Property()
    updatedby?: string
}