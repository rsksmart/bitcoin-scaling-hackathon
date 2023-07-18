import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Get, Post, Returns, Tags } from "@tsed/schema";
import { TicketService } from "../../../app-services/ticket/ticket.service";
import { MintTicketRequest, TransferTicketRequest } from "../../../dtos/request/ticket.request";
import { BadRequest, Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { Req } from "@tsed/common";

@Controller("/tickets")
@Tags("Ticket")
export class TicketController {
  @Inject(TicketService)
  protected service: TicketService;

  @Get("/")
  // @Returns(200, any)
  public async getTickets(
    @QueryParams("address") address?: string,
    @QueryParams("isContract") isContract?: boolean,
  ): Promise<any> {
    try {
      if (!address || isContract == undefined) throw new BadRequest("Missing query params");
      return await this.service.getTickets(address, isContract);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Post("/mint")
  @Authenticate("jwt-passport")
  @Returns(200, Boolean)
  public async mintTicket(
    @Req() req: any,
    @BodyParams() payload: MintTicketRequest,
  ): Promise<boolean> {
    try {
      return await this.service.mintTicket(req.user, payload);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }

  @Post("/transfer")
  @Authenticate("jwt-passport")
  @Returns(200, Boolean)
  public async transferTicket(
    @Req() req: any,
    @BodyParams() payload: TransferTicketRequest,
  ): Promise<boolean> {
    try {
      return await this.service.transferTicket(req.user, payload);
    } catch (err) {
      throw new Exception(err.status, err.message);
    }
  }
}
