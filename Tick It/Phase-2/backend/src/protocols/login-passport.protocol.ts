import { BodyParams, Inject, Req } from "@tsed/common";
import { NotAcceptable, NotFound, Unauthorized } from "@tsed/exceptions";
import { OnVerify, Protocol } from "@tsed/passport";
import { Strategy } from "passport-local";
import * as jwt from "jsonwebtoken";
import { LoginRequest } from "../dtos/request/auth.request";
import { USER_REPOSITORY } from "../repositories/user/user.repository";
import { EncryptionService } from "../app-services/encryption/encryption.service";
import { envs } from "../config/envs";

@Protocol({
  name: "login-passport",
  useStrategy: Strategy,
  settings: {
    usernameField: "username",
    passwordField: "password",
  },
})
export class LoginPassportProtocol implements OnVerify {
  @Inject(USER_REPOSITORY)
  userRepository: USER_REPOSITORY;

  @Inject(EncryptionService)
  encryptionService: EncryptionService;

  async $onVerify(@Req() req: Req, @BodyParams() payload: LoginRequest) {
    if (!payload.username || !payload.password) throw new NotAcceptable("Invalid parameters");

    const user = await this.userRepository.findOne({
      where: [
        { email: payload.username.toLowerCase(), isOAuth: false },
        { username: payload.username, isOAuth: false },
      ],
    });
    if (!user) throw new NotFound("User not found");

    const encryptedPassword = this.encryptionService.md5Encrypt(user.email + payload.password);
    if (encryptedPassword != user.password) throw new Unauthorized(`Invalid credentials`);

    const token = jwt.sign(
      {
        iss: envs.JWT_ISSUER,
        aud: envs.JWT_AUDIENCE,
        sub: user.id,
        exp: Date.now() + Number(envs.JWT_EXPIRATION_AGE) * 1000,
      },
      envs.JWT_KEY as string,
    );

    return (req.user = { token, user });
  }
}
