import { Inject, Service } from '@tsed/di';
import { OrderRequest } from '../../dtos/request/order.request';
import { OrderResponse } from '../../dtos/response/order.response';
import { ORDER_REPOSITORY } from '../../repositories/order/order.repository';
import { NotFound } from '@tsed/exceptions';

@Service()
export class OrderService {

    @Inject(ORDER_REPOSITORY)
    protected repository: ORDER_REPOSITORY;

    public async getOrders(filter?: any): Promise<Array<OrderResponse>> {
        const orders = filter ? await this.repository.find(filter) : await this.repository.find();
        if (!orders) return [];
        return orders;
    }

    public async createOrder(payload: OrderRequest): Promise<OrderResponse> {
        if (payload.id) payload.id = String(payload.id).toLowerCase()
        return await this.repository.save({ ...payload });
    }

    public async updateOrder(id: string, payload: OrderRequest): Promise<OrderResponse> {
        id = id.toLowerCase()
        await this.repository.update({ id: id }, { ...payload });

        const order = await this.repository.findOne({ where: { id: id } });
        if (!order)
            throw new NotFound("Order not found");

        return order;
    }

    public async removeOrder(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const order = await this.repository.findOne({ where: { id: id } });
        if (!order)
            throw new NotFound("Order not found");

        await this.repository.remove(order);
        return true;
    }
}