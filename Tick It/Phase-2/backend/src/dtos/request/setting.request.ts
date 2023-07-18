import { Property } from "@tsed/schema";

export class SettingRequest {
    @Property()
    id?: string;

    @Property()
    name: string;

    @Property()
    details: string;

    @Property()
    createdBy?: string

    @Property()
    updatedby?: string
}