import { Property } from "@tsed/schema";
import { Event } from "../../models/event";
import { EventMember } from "../../models/event-member";
import { OrganizationMember } from "../../models/organization-member";
import { OrganizationMemberResponse } from "./organization-member.response";

export class EventMemberResponse implements EventMember {
    @Property()
    id: string;

    @Property()
    memberId: string;

    @Property(() => OrganizationMemberResponse)
    member: OrganizationMember;

    @Property()
    eventId: string;

    @Property(() => Event)
    event: Event;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}