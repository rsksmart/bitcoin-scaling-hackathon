import { Property } from "@tsed/schema";
import { User } from "../../models/user";

export class UserResponse implements User {
  @Property()
  id: string;

  @Property()
  email: string;

  @Property()
  password: string;

  @Property()
  googleId: string;

  @Property()
  username: string;

  @Property()
  phoneNumber: string;

  @Property()
  isOAuth: boolean;

  @Property()
  isVerified: boolean;

  @Property()
  isActive: boolean;

  @Property()
  isActivated: boolean;

  @Property()
  notifications: string;

  @Property()
  createdAt: Date;

  @Property()
  createdBy: string;

  @Property()
  updatedAt: Date;

  @Property()
  updatedBy: string;
}
