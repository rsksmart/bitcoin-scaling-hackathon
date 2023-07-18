import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { PasswordRecoveryService } from "../../../app-services/password-recovery/password-recovery.service";
import { PasswordRecoveryRequest } from "../../../dtos/request/password-recovery.request";
import { PasswordRecoveryResponse } from "../../../dtos/response/password-recovery.response";
import { Exception } from "@tsed/exceptions";

@Controller("/passwordRecovery")
@Tags('PasswordRecovery')
export class PasswordRecoveryController {

    @Inject(PasswordRecoveryService)
    protected service: PasswordRecoveryService;

    @Get("/")
    @Returns(200, Array).Of(PasswordRecoveryResponse)
    public async getPasswordRecoveries(@QueryParams("filter") filter?: string): Promise<PasswordRecoveryResponse[]> {
        try {
            return filter ? await this.service.getPasswordRecoveries(JSON.parse(filter)) : await this.service.getPasswordRecoveries();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Returns(200, PasswordRecoveryResponse)
    public async createPasswordRecovery(@BodyParams() passwordRecovery: PasswordRecoveryRequest): Promise<PasswordRecoveryResponse> {
        try {
            return await this.service.createPasswordRecovery(passwordRecovery);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Returns(200, PasswordRecoveryResponse)
    public async updatePasswordRecovery(@PathParams("id") id: string, @BodyParams() passwordRecovery: PasswordRecoveryRequest): Promise<PasswordRecoveryResponse> {
        try {
            return await this.service.updatePasswordRecovery(id, passwordRecovery);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Returns(200, Boolean)
    public async removePasswordRecovery(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removePasswordRecovery(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}