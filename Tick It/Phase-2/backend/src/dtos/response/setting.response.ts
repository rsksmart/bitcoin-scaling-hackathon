import {  Property } from "@tsed/schema";
import { Setting } from "../../models/setting";

export class SettingResponse implements Setting {
    @Property()
    id: string;

    @Property()
    name: string;

    @Property()
    details: string;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}