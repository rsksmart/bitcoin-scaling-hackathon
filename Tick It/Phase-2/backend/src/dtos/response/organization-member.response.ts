import { Property } from "@tsed/schema";
import { MemberRole } from "../../models/member-role";
import { Organization } from "../../models/organization";
import { OrganizationMember } from "../../models/organization-member";
import { User } from "../../models/user";
import { MemberRoleResponse } from "./member-role.response";
import { UserResponse } from "./user.response";
import { OrganizationResponse } from "./organization.response";

export class OrganizationMemberResponse implements OrganizationMember {
    @Property()
    id: string;

    @Property()
    memberRoleId: string;

    @Property(() => MemberRoleResponse)
    memberRole: MemberRole;

    @Property()
    userId: string;

    @Property(() => UserResponse)
    user: User;

    @Property()
    organizationId: string;

    @Property(() => OrganizationResponse)
    organization: Organization;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}