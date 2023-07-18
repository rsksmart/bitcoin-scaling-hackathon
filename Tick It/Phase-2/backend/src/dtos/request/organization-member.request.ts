import { Property } from "@tsed/schema";

export class OrganizationMemberRequest {
    @Property()
    id?: string;

    @Property()
    memberRoleId: string;

    @Property()
    userId: string;

    @Property()
    organizationId: string;

    @Property()
    createdBy?: string

    @Property()
    updatedby?: string
}