import { Property } from "@tsed/schema";
import { Organization } from "../../models/organization";
import { User } from "../../models/user";
import { UserResponse } from "./user.response";

export class OrganizationResponse implements Organization {
  @Property()
  id: string;

  @Property()
  ownerId: string;

  @Property(() => UserResponse)
  owner: User;

  @Property()
  name: string;

  @Property()
  profile: string;

  @Property()
  banner: string;

  @Property()
  vettingObj: string;

  @Property()
  isVetted: boolean;

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
