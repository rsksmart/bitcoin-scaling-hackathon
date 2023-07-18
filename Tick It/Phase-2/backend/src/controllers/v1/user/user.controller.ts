import { Controller, Inject } from "@tsed/di";
import { BodyParams, HeaderParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { UserService } from "../../../app-services/user/user.service";
import { ChangePasswordRequest, UserRequest } from "../../../dtos/request/user.request";
import { UserResponse } from "../../../dtos/response/user.response";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { Req } from "@tsed/common";

@Controller("/users")
@Tags("User")
export class UserController {
  @Inject(UserService)
  protected service: UserService;

  @Get("/")
  @Returns(200, Array).Of(UserResponse)
  public async getUsers(@QueryParams("filter") filter?: string): Promise<UserResponse[]> {
    try {
      return filter
        ? await this.service.getUsers(JSON.parse(filter))
        : await this.service.getUsers();
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  //   @Post("/")
  //   @Authenticate("jwt-passport")
  //   @Returns(200, UserResponse)
  //   public async createUser(@BodyParams() user: UserRequest): Promise<UserResponse> {
  //     try {
  //       return await this.service.createUser(user);
  //     } catch (err) {
  //       throw new Exception(err.status, err.message);
  //     }
  //   }

  @Put("/changePassword")
  @Authenticate("jwt-passport")
  @Returns(200, Boolean)
  public async changePassword(
    @Req() req: any,
    @BodyParams() payload: ChangePasswordRequest,
  ): Promise<boolean> {
    try {
      return await this.service.changePassword(req.user, payload);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Put("/")
  @Authenticate("jwt-passport")
  @Returns(200, UserResponse)
  public async updateUser(@Req() req: any, @BodyParams() user: UserRequest): Promise<UserResponse> {
    try {
      return await this.service.updateUser(req.user, user);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  //   @Delete("/:id")
  //   @Authenticate("jwt-passport")
  //   @Returns(200, Boolean)
  //   public async removeUser(@HeaderParams() headers: any): Promise<boolean> {
  //     try {
  //       return await this.service.removeUser(headers);
  //     } catch (err) {
  //       throw new Exception(err.status, err.message);
  //     }
  //   }
}
