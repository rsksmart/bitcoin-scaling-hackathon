import {  Property } from "@tsed/schema";

export class AdminRequest {
    @Property()
    id?: string;

    @Property()
    name: string;

    @Property()
    adminRoleId: string;

    @Property()
    address?: string

    @Property()
    email?: string

    @Property()
    password?: string

    @Property()
    isActive: boolean;

    @Property()
    createdBy?: string

    @Property()
    updatedby?: string
}