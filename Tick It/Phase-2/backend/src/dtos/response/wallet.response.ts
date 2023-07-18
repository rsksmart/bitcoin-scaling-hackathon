import { Property } from "@tsed/schema";
import { User } from "../../models/user";
import { Wallet, WalletType } from "../../models/wallet";
import { UserResponse } from "./user.response";

export class WalletResponse implements Wallet {
    @Property()
    id: string;

    @Property()
    userId: string;

    @Property(() => UserResponse)
    user: User;

    @Property()
    address: string

    @Property()
    type: WalletType

    @Property()
    phrase: string

    @Property()
    createdAt: Date;

    @Property()
    createdBy: string;

    @Property()
    updatedAt: Date;

    @Property()
    updatedBy: string;
}