import {  Property } from "@tsed/schema";

export class AdminRoleRequest {
    @Property()
    id?: string;

    @Property()
    roleName: string;

    @Property()
    createdBy?: string

    @Property()
    updatedby?: string
}