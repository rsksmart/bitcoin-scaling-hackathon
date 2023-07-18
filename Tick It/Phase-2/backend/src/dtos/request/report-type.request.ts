import { Property } from "@tsed/schema";

export class ReportTypeRequest {
    @Property()
    id?: string;

    @Property()
    name: string;

    @Property()
    createdBy?: string

    @Property()
    updatedby?: string
}