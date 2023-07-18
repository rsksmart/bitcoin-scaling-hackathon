import { Inject, Service } from '@tsed/di';
import { SettingRequest } from '../../dtos/request/setting.request';
import { SettingResponse } from '../../dtos/response/setting.response';
import { SETTING_REPOSITORY } from '../../repositories/setting/setting.repository';
import { NotFound } from '@tsed/exceptions';

@Service()
export class SettingService {

    @Inject(SETTING_REPOSITORY)
    protected repository: SETTING_REPOSITORY;

    public async getSettings(filter?: any): Promise<Array<SettingResponse>> {
        const settings = filter ? await this.repository.find(filter) : await this.repository.find();
        if (!settings) return [];
        return settings;
    }

    public async createSetting(payload: SettingRequest): Promise<SettingResponse> {
        if (payload.id) payload.id = String(payload.id).toLowerCase();
        return await this.repository.save({ ...payload });
    }

    public async updateSetting(id: string, payload: SettingRequest): Promise<SettingResponse> {
        id = id.toLowerCase()
        await this.repository.update({ id: id }, { ...payload });

        const setting = await this.repository.findOne({ where: { id: id } });
        if (!setting)
            throw new NotFound("Setting not found");

        return setting;
    }

    public async removeSetting(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const setting = await this.repository.findOne({ where: { id: id } });
        if (!setting)
            throw new NotFound("Setting not found");

        await this.repository.remove(setting);
        return true;
    }
}