import { registerProvider } from "@tsed/di";
import { Order } from "../../models/order";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";

export const OrderRepository = PostgresDataSource.getRepository(Order);

export const ORDER_REPOSITORY = Symbol.for("OrderRepository");
export type ORDER_REPOSITORY = typeof OrderRepository;

registerProvider({
    provide: ORDER_REPOSITORY,
    useValue: OrderRepository
});