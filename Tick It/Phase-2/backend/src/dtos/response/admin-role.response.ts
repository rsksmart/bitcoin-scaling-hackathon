import { Property } from "@tsed/schema";
import { AdminRole } from "../../models/admin-role";


export class AdminRoleResponse implements AdminRole {
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