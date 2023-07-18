import {  Property } from "@tsed/schema";
import { ReportType } from "../../models/report-type";

export class ReportTypeResponse implements ReportType {
    @Property()
    id: string;

    @Property()
    name: string;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}