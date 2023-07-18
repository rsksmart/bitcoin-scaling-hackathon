import { Property } from "@tsed/schema";
import { Event } from "../../models/event";
import { Order } from "../../models/order";
import { PaymentType } from "../../models/payment-type";
import { User } from "../../models/user";
import { PaymentTypeResponse } from "./payment-type.response";
import { EventResponse } from "./event.response";
import { UserResponse } from "./user.response";

export class OrderResponse implements Order {
    @Property()
    id: string;

    @Property()
    paymentTypeId: string;

    @Property(() => PaymentTypeResponse)
    paymentType: PaymentType;

    @Property()
    userId: string;

    @Property(() => UserResponse)
    user: User;

    @Property()
    eventId: string;

    @Property(() => EventResponse)
    event: Event;

    @Property()
    totalAmount: number;

    @Property()
    details: string;

    @Property()
    status: string;

    @Property()
    responseMessage: string;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}