import { Property } from "@tsed/schema";

export class OrganizationRequest {
  @Property()
  id?: string;

  @Property()
  ownerId: string;

  @Property()
  name: string;

  @Property()
  profile: string;

  @Property()
  banner: string;

  @Property()
  vettingObj?: string;

  @Property()
  isVetted: boolean;

  @Property()
  isActive: boolean;

  @Property()
  createdBy?: string;

  @Property()
  updatedby?: string;
}
