import { Property } from "@tsed/schema";

export class InvitationRequest {
    @Property()
    id?: string;

    @Property()
    senderId: string;

    @Property()
    organizationId: string;

    @Property()
    email: string

    @Property()
    memberRoleId: string

    @Property()
    receiverId: string

    @Property()
    status: string;

    @Property()
    createdBy?: string

    @Property()
    updatedby?: string
}