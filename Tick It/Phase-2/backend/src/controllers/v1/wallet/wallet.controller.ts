import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { WalletService } from "../../../app-services/wallet/wallet.service";
import { LinkWalletRequest, WalletRequest } from "../../../dtos/request/wallet.request";
import { WalletResponse } from "../../../dtos/response/wallet.response";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { Req } from "@tsed/common";

@Controller("/wallets")
@Tags("Wallet")
export class WalletController {
  @Inject(WalletService)
  protected service: WalletService;

  @Get("/")
  @Returns(200, Array).Of(WalletResponse)
  public async getWallets(@QueryParams("filter") filter?: string): Promise<WalletResponse[]> {
    try {
      return filter
        ? await this.service.getWallets(JSON.parse(filter))
        : await this.service.getWallets();
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  //   @Post("/")
  //   @Authenticate("jwt-passport")
  //   @Returns(200, WalletResponse)
  //   public async createWallet(@BodyParams() wallet: WalletRequest): Promise<WalletResponse> {
  //     try {
  //       return await this.service.createWallet(wallet);
  //     } catch (err) {
  //       throw new Exception(err.status, err.message);
  //     }
  //   }

  @Post("/link")
  @Authenticate("jwt-passport")
  @Returns(200, WalletResponse)
  public async linkWallet(
    @Req() req: any,
    @BodyParams() wallet: LinkWalletRequest,
  ): Promise<WalletResponse> {
    try {
      return await this.service.linkWallet(req.user, wallet);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  //   @Put("/:id")
  //   @Authenticate("jwt-passport")
  //   @Returns(200, WalletResponse)
  //   public async updateWallet(
  //     @PathParams("id") id: string,
  //     @BodyParams() wallet: WalletRequest,
  //   ): Promise<WalletResponse> {
  //     try {
  //       return await this.service.updateWallet(id, wallet);
  //     } catch (err) {
  //       throw new Exception(err.status, err.message);
  //     }
  //   }

  @Delete("/unlink/:id")
  @Authenticate("jwt-passport")
  @Returns(200, Boolean)
  public async unlinkWallet(@Req() req: any, @PathParams("id") id: string): Promise<boolean> {
    try {
      return await this.service.unlinkWallet(req.user, id);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  //   @Delete("/:id")
  //   @Authenticate("jwt-passport")
  //   @Returns(200, Boolean)
  //   public async removeWallet(@PathParams("id") id: string): Promise<boolean> {
  //     try {
  //       return await this.service.removeWallet(id);
  //     } catch (err) {
  //       throw new Exception(err.status, err.message);
  //     }
  //   }
}
