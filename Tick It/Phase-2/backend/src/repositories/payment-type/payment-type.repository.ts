import { registerProvider } from "@tsed/di";
import { PaymentType } from "../../models/payment-type";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";

export const PaymentTypeRepository = PostgresDataSource.getRepository(PaymentType);

export const PAYMENT_TYPE_REPOSITORY = Symbol.for("PaymentTypeRepository");
export type PAYMENT_TYPE_REPOSITORY = typeof PaymentTypeRepository;

registerProvider({
    provide: PAYMENT_TYPE_REPOSITORY,
    useValue: PaymentTypeRepository
});