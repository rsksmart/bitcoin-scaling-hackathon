import { Property } from "@tsed/schema";
import { Category } from "../../models/category";
import { Event } from "../../models/event";
import { Organization } from "../../models/organization";
import { CategoryResponse } from "./category.response";
import { OrganizationResponse } from "./organization.response";

export class EventResponse implements Event {
  @Property()
  id: string;

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
  media: string;

  @Property()
  urls: string;

  @Property()
  contractAddress: string;

  @Property()
  categoryId: string;

  @Property(() => CategoryResponse)
  category: Category;

  @Property()
  totalSupply: number;

  @Property()
  organizationId: string;

  @Property(() => OrganizationResponse)
  organization: Organization;

  @Property()
  isPublished: boolean;

  @Property()
  isActive: boolean;

  @Property()
  createdAt: Date;

  @Property()
  createdBy: string;

  @Property()
  updatedAt: Date;

  @Property()
  updatedBy: string;
}
