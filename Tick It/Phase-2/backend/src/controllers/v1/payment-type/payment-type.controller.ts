import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { PaymentTypeService } from "../../../app-services/payment-type/payment-type.service";
import { PaymentTypeRequest } from "../../../dtos/request/payment-type.request";
import { PaymentTypeResponse } from "../../../dtos/response/payment-type.response";
import { Exception } from "@tsed/exceptions";

@Controller("/paymentTypes")
@Tags('PaymentType')
export class PaymentTypeController {

    @Inject(PaymentTypeService)
    protected service: PaymentTypeService;

    @Get("/")
    @Returns(200, Array).Of(PaymentTypeResponse)
    public async getPaymentTypes(@QueryParams("filter") filter?: string): Promise<PaymentTypeResponse[]> {
        try {
            return filter ? await this.service.getPaymentTypes(JSON.parse(filter)) : await this.service.getPaymentTypes();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Returns(200, PaymentTypeResponse)
    public async createPaymentType(@BodyParams() paymentType: PaymentTypeRequest): Promise<PaymentTypeResponse> {
        try {
            return await this.service.createPaymentType(paymentType);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Returns(200, PaymentTypeResponse)
    public async updatePaymentType(@PathParams("id") id: string, @BodyParams() paymentType: PaymentTypeRequest): Promise<PaymentTypeResponse> {
        try {
            return await this.service.updatePaymentType(id, paymentType);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Returns(200, Boolean)
    public async removePaymentType(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removePaymentType(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}