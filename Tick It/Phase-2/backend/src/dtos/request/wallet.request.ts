import { Property } from "@tsed/schema";
import { WalletType } from "../../models/wallet";

export class WalletRequest {
  @Property()
  id?: string;

  @Property()
  userId: string;

  @Property()
  address: string;

  @Property()
  type: WalletType;

  @Property()
  phrase?: string;

  @Property()
  createdBy?: string;

  @Property()
  updatedby?: string;
}

export class LinkWalletRequest {
  @Property()
  address: string;
}
