
import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post, Returns, Tags } from "@tsed/schema";
import { CustodialService } from "../../../app-services/custodial/custodial.service";
import { SendTransactionRequest, SignMessageRequest, SignTransactionRequest } from "../../../dtos/request/custodial.request";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";
import { Req } from "@tsed/common";

@Controller("/custodial")
@Tags('Custodial')
export class CustodialController {

    @Inject(CustodialService)
    protected service: CustodialService;

    @Post("/signMessage")
    @Authenticate("jwt-passport")
    @Returns(200, String)
    public async signMessage(@Req() req: any, @BodyParams() body: SignMessageRequest): Promise<string> {
        try {
            return await this.service.signMessage(req.user, body);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/signTransaction")
    @Authenticate("jwt-passport")
    @Returns(200, String)
    public async signTransaction(@Req() req: any, @BodyParams() body: SignTransactionRequest): Promise<string> {
        try {
            return await this.service.signTransaction(req.user, body);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/sendTransaction")
    @Authenticate("jwt-passport")
    @Returns(200, Boolean)
    public async sendTransaction(@Req() req: any, @BodyParams() body: SendTransactionRequest): Promise<boolean> {
        try {
            return await this.service.sendTransaction(req.user, body);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}