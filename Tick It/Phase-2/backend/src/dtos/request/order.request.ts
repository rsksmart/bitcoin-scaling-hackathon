import { Property } from "@tsed/schema";

export class OrderRequest {
    @Property()
    id?: string;

    @Property()
    paymentTypeId: string;

    @Property()
    userId: string;

    @Property()
    eventId: string

    @Property()
    totalAmount: number

    @Property()
    details: string

    @Property()
    status: string;

    @Property()
    responseMessage: string;

    @Property()
    createdBy?: string

    @Property()
    updatedby?: string
}