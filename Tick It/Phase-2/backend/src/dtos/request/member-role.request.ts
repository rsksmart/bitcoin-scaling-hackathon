import { Property } from "@tsed/schema";

export class MemberRoleRequest {
    @Property()
    id?: string;

    @Property()
    roleName: string;

    @Property()
    createdBy?: string

    @Property()
    updatedby?: string
}