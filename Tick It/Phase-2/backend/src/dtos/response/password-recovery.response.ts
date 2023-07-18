import { Property } from "@tsed/schema";
import { PasswordRecovery, StatusType } from "../../models/password-recovery";

export class PasswordRecoveryResponse implements PasswordRecovery {
    @Property()
    id: string;

    @Property()
    email: string;

    @Property()
    token: string;

    @Property()
    status: StatusType;

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}