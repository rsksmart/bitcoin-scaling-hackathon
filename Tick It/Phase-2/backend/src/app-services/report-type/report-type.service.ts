import { Inject, Service } from '@tsed/di';
import { ReportTypeRequest } from '../../dtos/request/report-type.request';
import { ReportTypeResponse } from '../../dtos/response/report-type.response';
import { REPORT_TYPE_REPOSITORY } from '../../repositories/report-type/report-type.repository';
import { NotFound } from '@tsed/exceptions';

@Service()
export class ReportTypeService {

    @Inject(REPORT_TYPE_REPOSITORY)
    protected repository: REPORT_TYPE_REPOSITORY;

    public async getReportTypes(filter?: any): Promise<Array<ReportTypeResponse>> {
        const reportTypes = filter ? await this.repository.find(filter) : await this.repository.find();
        if (!reportTypes) return [];
        return reportTypes;
    }

    public async createReportType(payload: ReportTypeRequest): Promise<ReportTypeResponse> {
        if (payload.id) payload.id = String(payload.id).toLowerCase();
        return await this.repository.save({ ...payload });
    }

    public async updateReportType(id: string, payload: ReportTypeRequest): Promise<ReportTypeResponse> {
        id = id.toLowerCase()
        await this.repository.update({ id: id }, { ...payload });

        const reportType = await this.repository.findOne({ where: { id: id } });
        if (!reportType)
            throw new NotFound("ReportType not found");

        return reportType;
    }

    public async removeReportType(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const reportType = await this.repository.findOne({ where: { id: id } });
        if (!reportType)
            throw new NotFound("ReportType not found");

        await this.repository.remove(reportType);
        return true;
    }
}