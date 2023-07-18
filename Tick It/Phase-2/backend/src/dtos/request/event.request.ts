import { Property } from "@tsed/schema";

export class EventRequest {
  @Property()
  id?: string;

  @Property()
  name: string;

  @Property()
  symbol: string;

  @Property()
  slug: string;

  @Property()
  description: string;

  @Property()
  eventDate: Date;

  @Property()
  location: string;

  @Property()
  banner: string;

  @Property()
  media?: string;

  @Property()
  urls?: string;

  @Property()
  contractAddress?: string;

  @Property()
  categoryId: string;

  @Property()
  totalSupply?: number;

  @Property()
  organizationId: string;

  @Property()
  isPublished: boolean;

  @Property()
  isActive: boolean;

  @Property()
  createdBy?: string;

  @Property()
  updatedby?: string;
}
