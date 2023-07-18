import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams, QueryParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns, Tags } from "@tsed/schema";
import { ReportService } from "../../../app-services/report/report.service";
import { ReportRequest } from "../../../dtos/request/report.request";
import { ReportResponse } from "../../../dtos/response/report.response";
import { Exception } from "@tsed/exceptions";
import { Authenticate } from "@tsed/passport";

@Controller("/reports")
@Tags('Report')
export class ReportController {

    @Inject(ReportService)
    protected service: ReportService;

    @Get("/")
    @Returns(200, Array).Of(ReportResponse)
    public async getReports(@QueryParams("filter") filter?: string): Promise<ReportResponse[]> {
        try {
            return filter ? await this.service.getReports(JSON.parse(filter)) : await this.service.getReports();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Authenticate("jwt-passport")
    @Returns(200, ReportResponse)
    public async createReport(@BodyParams() report: ReportRequest): Promise<ReportResponse> {
        try {
            return await this.service.createReport(report);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Put("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, ReportResponse)
    public async updateReport(@PathParams("id") id: string, @BodyParams() report: ReportRequest): Promise<ReportResponse> {
        try {
            return await this.service.updateReport(id, report);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/:id")
    @Authenticate("jwt-passport")
    @Returns(200, Boolean)
    public async removeReport(@PathParams("id") id: string): Promise<boolean> {
        try {
            return await this.service.removeReport(id);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}