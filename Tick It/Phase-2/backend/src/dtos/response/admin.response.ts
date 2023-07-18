import { Property } from "@tsed/schema";
import { Admin } from "../../models/admin";
import { AdminRole } from "../../models/admin-role";
import { AdminRoleResponse } from "./admin-role.response";


export class AdminResponse implements Admin {
    @Property()
    id: string;

    @Property()
    name: string;

    @Property()
    adminRoleId: string;

    @Property(() => AdminRoleResponse)
    adminRole: AdminRole;

    @Property()
    address: string;

    @Property()
    email: string;

    @Property()
    password: string;

    @Property()
    isActive: boolean;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}