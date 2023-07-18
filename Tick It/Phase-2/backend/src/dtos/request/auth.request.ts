import { Property } from "@tsed/schema";

export class LoginRequest {
  @Property()
  username: string;

  @Property()
  password: string;
}

export class PasswordRecoveryRequest {
  @Property()
  email?: string;

  @Property()
  username?: string;
}

export class UpdatePasswordRequest {
  @Property()
  password: string;
}

export class OAuthRequest {
  @Property()
  email: string;

  @Property()
  username: string;
}
