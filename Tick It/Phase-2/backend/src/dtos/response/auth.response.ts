import { Property } from "@tsed/schema";
import { User } from "../../models/user";

export class AuthResponse {
  @Property()
  token: string;

  @Property(() => User)
  user: User;
}
