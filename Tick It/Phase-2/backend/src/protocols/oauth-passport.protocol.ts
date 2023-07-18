import { Inject, Res } from "@tsed/common";
import { Arg, OnVerify, Protocol } from "@tsed/passport";
import { AuthService } from "../app-services/auth/auth.service";
import { UserRequest } from "../dtos/request/user.request";
import * as jwt from "jsonwebtoken";
import { envs } from "../config/envs";
import { USER_REPOSITORY } from "../repositories/user/user.repository";
const GoogleStrategy = require("passport-google-oauth20").Strategy;

@Protocol({
  name: "oauth-passport",
  useStrategy: GoogleStrategy,
  settings: {
    clientID: envs.CLIENT_ID,
    clientSecret: envs.CLIENT_SECRET,
    callbackURL: envs.CALLBACK_URL,
  },
})
export class OAuthPassportProtocol implements OnVerify {
  @Inject(AuthService)
  authService: AuthService;

  @Inject(USER_REPOSITORY)
  userRepository: USER_REPOSITORY;

  async $onVerify(
    @Res() res: any,
    @Arg(0) accessToken: string,
    @Arg(1) refreshToken: any,
    @Arg(2) profile: any,
  ) {
    let user = await this.userRepository.findOne({
      where: [{ googleId: profile.id, isOAuth: true }],
    });

    if (!user)
      user = await this.authService.signup({
        googleId: profile.id,
        username: profile.emails[0].value.split("@")[0],
        isOAuth: true,
      } as UserRequest);

    const token = jwt.sign(
      {
        iss: envs.JWT_ISSUER,
        aud: envs.JWT_AUDIENCE,
        sub: user.id,
        exp: Date.now() + Number(envs.JWT_EXPIRATION_AGE) * 1000,
      },
      envs.JWT_KEY as string,
    );

    res.cookie("token", token, { domain: ".cryptoware.me" });

    res.redirect(`${envs.REDIRECT_URL}`);

    return true;
  }
}
