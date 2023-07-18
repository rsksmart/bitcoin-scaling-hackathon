import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { SettingService } from "../../../app-services/setting/setting.service";
import { SettingRequest } from "../../../dtos/request/setting.request";
import { SettingResponse } from "../../../dtos/response/setting.response";
import { Exception } from "@tsed/exceptions";

@Controller("/settings")
@Tags('Setting')
export class SettingController {

    @Inject(SettingService)
    protected service: SettingService;

    @Get("/")
    @Returns(200, Array).Of(SettingResponse)
    public async getSettings(@QueryParams("filter") filter?: string): Promise<SettingResponse[]> {
        try {
            return filter ? await this.service.getSettings(JSON.parse(filter)) : await this.service.getSettings();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Returns(200, SettingResponse)
    public async createSetting(@BodyParams() setting: SettingRequest): Promise<SettingResponse> {
        try {
            return await this.service.createSetting(setting);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Returns(200, SettingResponse)
    public async updateSetting(@PathParams("id") id: string, @BodyParams() setting: SettingRequest): Promise<SettingResponse> {
        try {
            return await this.service.updateSetting(id, setting);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Returns(200, Boolean)
    public async removeSetting(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeSetting(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}