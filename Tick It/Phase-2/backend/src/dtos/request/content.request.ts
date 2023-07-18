import {  Property } from "@tsed/schema";

export class ContentRequest {
    @Property()
    id?: string;

    @Property()
    contentName: string;

    @Property()
    contentType: number;

    @Property()
    contentJson?: string;

    @Property()
    createdBy?: string

    @Property()
    updatedby?: string
}