import { BodyParams, Inject, Req } from "@tsed/common";
import { Conflict, NotAcceptable } from "@tsed/exceptions";
import { OnVerify, Protocol } from "@tsed/passport";
import { Strategy } from "passport-local";
import * as jwt from "jsonwebtoken";
import { USER_REPOSITORY } from "../repositories/user/user.repository";
import { EncryptionService } from "../app-services/encryption/encryption.service";
import { envs } from "../config/envs";
import { UserRequest } from "../dtos/request/user.request";
import { EmailQueueService } from "../services/queues/email.queue";
import { WalletService } from "../app-services/wallet/wallet.service";
import { AuthService } from "../app-services/auth/auth.service";

@Protocol({
  name: "signup-passport",
  useStrategy: Strategy,
  settings: {
    usernameField: "username",
    passwordField: "password",
  },
})
export class SignupPassportProtocol implements OnVerify {
  @Inject(AuthService)
  authService: AuthService;

  @Inject(USER_REPOSITORY)
  userRepository: USER_REPOSITORY;

  @Inject(EncryptionService)
  encryptionService: EncryptionService;

  @Inject(EmailQueueService)
  protected emailQueueService: EmailQueueService;

  @Inject(WalletService)
  protected walletService: WalletService;

  async $onVerify(@Req() req: Req, @BodyParams() payload: UserRequest) {
    if (!payload.email || !payload.username || !payload.password)
      throw new NotAcceptable("Invalid parameters");

    const found = await this.userRepository.findOne({
      where: [{ email: payload.email?.toLowerCase() }, { username: payload.username }],
    });
    if (found) throw new Conflict("Email or username already in use");

    const user = await this.authService.signup(payload);

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
