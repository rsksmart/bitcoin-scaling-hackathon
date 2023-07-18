import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { OrderService } from "../../../app-services/order/order.service";
import { OrderRequest } from "../../../dtos/request/order.request";
import { OrderResponse } from "../../../dtos/response/order.response";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";

@Controller("/orders")
@Tags('Order')
export class OrderController {

    @Inject(OrderService)
    protected service: OrderService;

    @Get("/")
    @Returns(200, Array).Of(OrderResponse)
    public async getOrders(@QueryParams("filter") filter?: string): Promise<OrderResponse[]> {
        try {
            return filter ? await this.service.getOrders(JSON.parse(filter)) : await this.service.getOrders();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Authenticate("jwt-passport")
    @Returns(200, OrderResponse)
    public async createOrder(@BodyParams() order: OrderRequest): Promise<OrderResponse> {
        try {
            return await this.service.createOrder(order);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, OrderResponse)
    public async updateOrder(@PathParams("id") id: string, @BodyParams() order: OrderRequest): Promise<OrderResponse> {
        try {
            return await this.service.updateOrder(id, order);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, Boolean)
    public async removeOrder(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeOrder(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}