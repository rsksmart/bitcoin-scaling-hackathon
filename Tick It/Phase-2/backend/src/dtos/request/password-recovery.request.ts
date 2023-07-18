import { Property } from "@tsed/schema";
import { StatusType } from "../../models/password-recovery";

export class PasswordRecoveryRequest {
    @Property()
    id?: string;

    @Property()
    email: string;

    @Property()
    token: string;

    @Property()
    status: StatusType;

    @Property()
    createdBy?: string

    @Property()
    updatedby?: string
}