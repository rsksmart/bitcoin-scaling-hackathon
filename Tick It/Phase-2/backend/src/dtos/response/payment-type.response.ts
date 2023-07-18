import { Property } from "@tsed/schema";
import { PaymentType } from "../../models/payment-type";

export class PaymentTypeResponse implements PaymentType {
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