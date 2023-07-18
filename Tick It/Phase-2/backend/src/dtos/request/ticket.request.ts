import { Property } from "@tsed/schema";

export class MintTicketRequest {
  @Property()
  contractAddress: string;

  @Property()
  proof: string;

  @Property()
  ticketTypeCounts: number[];
}

export class TransferTicketRequest {
  @Property()
  eventId: string;

  @Property()
  address: string;

  @Property()
  tokenId: number;
}
