import { Property } from "@tsed/schema";

export class UserRequest {
  @Property()
  id?: string;

  @Property()
  email?: string;

  @Property()
  password?: string;

  @Property()
  googleId?: string;

  @Property()
  username: string;

  @Property()
  phoneNumber?: string;

  @Property()
  isOAuth: boolean;

  @Property()
  isVerified: boolean;

  @Property()
  isActive: boolean;

  @Property()
  isActivated: boolean;

  @Property()
  notifications?: string;

  @Property()
  createdBy?: string;

  @Property()
  updatedby?: string;
}
export class ChangePasswordRequest {
  @Property()
  oldPassword: string;

  @Property()
  newPassword: string;
}
