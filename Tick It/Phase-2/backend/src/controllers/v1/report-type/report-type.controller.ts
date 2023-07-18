import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { ReportTypeService } from "../../../app-services/report-type/report-type.service";
import { ReportTypeRequest } from "../../../dtos/request/report-type.request";
import { ReportTypeResponse } from "../../../dtos/response/report-type.response";
import { Exception } from "@tsed/exceptions";

@Controller("/reportTypes")
@Tags('ReportType')
export class ReportTypeController {

    @Inject(ReportTypeService)
    protected service: ReportTypeService;

    @Get("/")
    @Returns(200, Array).Of(ReportTypeResponse)
    public async getReportTypes(@QueryParams("filter") filter?: string): Promise<ReportTypeResponse[]> {
        try {
            return filter ? await this.service.getReportTypes(JSON.parse(filter)) : await this.service.getReportTypes();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Returns(200, ReportTypeResponse)
    public async createReportType(@BodyParams() reportType: ReportTypeRequest): Promise<ReportTypeResponse> {
        try {
            return await this.service.createReportType(reportType);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Returns(200, ReportTypeResponse)
    public async updateReportType(@PathParams("id") id: string, @BodyParams() reportType: ReportTypeRequest): Promise<ReportTypeResponse> {
        try {
            return await this.service.updateReportType(id, reportType);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Returns(200, Boolean)
    public async removeReportType(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeReportType(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}