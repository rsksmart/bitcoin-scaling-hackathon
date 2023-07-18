import { Inject, Service } from '@tsed/di';
import { PaymentTypeRequest } from '../../dtos/request/payment-type.request';
import { PaymentTypeResponse } from '../../dtos/response/payment-type.response';
import { PAYMENT_TYPE_REPOSITORY } from '../../repositories/payment-type/payment-type.repository';
import { NotFound } from '@tsed/exceptions';

@Service()
export class PaymentTypeService {

    @Inject(PAYMENT_TYPE_REPOSITORY)
    protected repository: PAYMENT_TYPE_REPOSITORY;

    public async getPaymentTypes(filter?: any): Promise<Array<PaymentTypeResponse>> {
        const paymentTypes = filter ? await this.repository.find(filter) : await this.repository.find();
        if (!paymentTypes) return [];
        return paymentTypes;
    }

    public async createPaymentType(payload: PaymentTypeRequest): Promise<PaymentTypeResponse> {
        if (payload.id) payload.id = String(payload.id).toLowerCase();
        return await this.repository.save({ ...payload });
    }

    public async updatePaymentType(id: string, payload: PaymentTypeRequest): Promise<PaymentTypeResponse> {
        id = id.toLowerCase()
        await this.repository.update({ id: id }, { ...payload });

        const paymentType = await this.repository.findOne({ where: { id: id } });
        if (!paymentType)
            throw new NotFound("PaymentType not found");

        return paymentType;
    }

    public async removePaymentType(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const paymentType = await this.repository.findOne({ where: { id: id } });
        if (!paymentType)
            throw new NotFound("PaymentType not found");

        await this.repository.remove(paymentType);
        return true;
    }
}