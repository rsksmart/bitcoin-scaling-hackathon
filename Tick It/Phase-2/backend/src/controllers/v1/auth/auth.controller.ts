import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { Req, Res } from "@tsed/common";
import { UserRequest } from "../../../dtos/request/user.request";
import { UserResponse } from "../../../dtos/response/user.response";
import { LoginRequest } from "../../../dtos/request/auth.request";
import { AuthResponse } from "../../../dtos/response/auth.response";
import { AuthService } from "../../../app-services/auth/auth.service";
import { PasswordRecoveryRequest } from "../../../dtos/request/auth.request";
import { UpdatePasswordRequest } from "../../../dtos/request/auth.request";

@Controller("/auth")
@Tags("Auth")
export class AuthController {
  @Inject(AuthService)
  protected service: AuthService;

  @Get("/oAuth")
  @Authenticate("oauth-passport", { scope: ["profile", "email"] })
  @Returns(200, AuthResponse)
  public async oAuth(@Req() req: any, @Res() res: any): Promise<Boolean> {
    try {
      return true;
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Get("/oAuth/callback")
  @Authenticate("oauth-passport", {
    failureRedirect: "http://localhost:3000/fail",
    failWithError: true,
  })
  @Returns(200, AuthResponse)
  public async oAuthCallback(@Req() req: any, @Res() res: any): Promise<Boolean> {
    try {
      return true;
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Post("/login")
  @Authenticate("login-passport")
  @Returns(200, AuthResponse)
  public async login(
    @Req() req: any,
    @Res() res: any,
    @BodyParams() user: LoginRequest,
  ): Promise<AuthResponse> {
    try {
      return res.send(req.user);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Post("/signup")
  @Authenticate("signup-passport")
  @Returns(200, AuthResponse)
  public async signup(
    @Req() req: any,
    @Res() res: any,
    @BodyParams() user: UserRequest,
  ): Promise<AuthResponse> {
    try {
      return res.send(req.user);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Post("/validateToken")
  @Authenticate("jwt-passport")
  @Returns(200, AuthResponse)
  public async validateToken(@Req() req: any): Promise<UserResponse> {
    try {
      return req.user;
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Put("/requestPasswordRecovery")
  @Returns(200, AuthResponse)
  public async requestPasswordRecovery(
    @BodyParams() payload: PasswordRecoveryRequest,
  ): Promise<Boolean> {
    try {
      return await this.service.requestPasswordRecovery(payload);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Put("/updatePassword/:token")
  @Returns(200, AuthResponse)
  public async updatePassword(
    @PathParams("token") token: string,
    @BodyParams() payload: UpdatePasswordRequest,
  ): Promise<Boolean> {
    try {
      return await this.service.updatePassword(token, payload);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}
