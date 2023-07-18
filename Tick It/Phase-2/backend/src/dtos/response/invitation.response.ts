import { Property } from "@tsed/schema";
import { Invitation } from "../../models/invitation";
import { MemberRole } from "../../models/member-role";
import { Organization } from "../../models/organization";
import { User } from "../../models/user";
import { OrganizationResponse } from "./organization.response";
import { MemberRoleResponse } from "./member-role.response";
import { UserResponse } from "./user.response";

export class InvitationResponse implements Invitation {
    @Property()
    id: string;

    @Property()
    senderId: string;

    @Property(() => UserResponse)
    sender: User;

    @Property()
    organizationId: string;

    @Property(() => OrganizationResponse)
    organization: Organization;

    @Property()
    email: string;

    @Property()
    memberRoleId: string;

    @Property(() => MemberRoleResponse)
    memberRole: MemberRole;

    @Property()
    receiverId: string;

    @Property(() => UserResponse)
    receiver: User;

    @Property()
    status: string;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}