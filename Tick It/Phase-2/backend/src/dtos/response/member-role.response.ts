import { Property } from "@tsed/schema";
import { MemberRole } from "../../models/member-role";

export class MemberRoleResponse implements MemberRole {
    @Property()
    id: string;

    @Property()
    roleName: string;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}