import { Inject, Service } from '@tsed/di';
import { PasswordRecoveryRequest } from '../../dtos/request/password-recovery.request';
import { PasswordRecoveryResponse } from '../../dtos/response/password-recovery.response';
import { PASSWORD_RECOVERY_REPOSITORY } from '../../repositories/password-recovery/password-recovery.repository';
import { NotFound } from '@tsed/exceptions';

@Service()
export class PasswordRecoveryService {

    @Inject(PASSWORD_RECOVERY_REPOSITORY)
    protected repository: PASSWORD_RECOVERY_REPOSITORY;

    public async getPasswordRecoveries(filter?: any): Promise<Array<PasswordRecoveryResponse>> {
        const passwordRecoveries = filter ? await this.repository.find(filter) : await this.repository.find();
        if (!passwordRecoveries) return [];
        return passwordRecoveries;
    }

    public async createPasswordRecovery(payload: PasswordRecoveryRequest): Promise<PasswordRecoveryResponse> {
        if (payload.id) payload.id = String(payload.id).toLowerCase();
        return await this.repository.save({ ...payload });
    }

    public async updatePasswordRecovery(id: string, payload: PasswordRecoveryRequest): Promise<PasswordRecoveryResponse> {
        id = id.toLowerCase()
        await this.repository.update({ id: id }, { ...payload });

        const passwordRecovery = await this.repository.findOne({ where: { id: id } });
        if (!passwordRecovery)
            throw new NotFound("PasswordRecovery not found");

        return passwordRecovery;
    }

    public async removePasswordRecovery(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const passwordRecovery = await this.repository.findOne({ where: { id: id } });
        if (!passwordRecovery)
            throw new NotFound("PasswordRecovery not found");

        await this.repository.remove(passwordRecovery);
        return true;
    }
}