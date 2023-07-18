import { Inject, Service } from '@tsed/di';
import { ReportRequest } from '../../dtos/request/report.request';
import { ReportResponse } from '../../dtos/response/report.response';
import { REPORT_REPOSITORY } from '../../repositories/report/report.repository';
import { NotFound } from '@tsed/exceptions';

@Service()
export class ReportService {

    @Inject(REPORT_REPOSITORY)
    protected repository: REPORT_REPOSITORY;

    public async getReports(filter?: any): Promise<Array<ReportResponse>> {
        const reports = filter ? await this.repository.find(filter) : await this.repository.find();
        if (!reports) return [];
        return reports;
    }

    public async createReport(payload: ReportRequest): Promise<ReportResponse> {
        if (payload.id) payload.id = String(payload.id).toLowerCase();
        return await this.repository.save({  ...payload });
    }

    public async updateReport(id: string, payload: ReportRequest): Promise<ReportResponse> {
        id = id.toLowerCase()
        await this.repository.update({ id: id }, { ...payload });

        const report = await this.repository.findOne({ where: { id: id } });
        if (!report)
            throw new NotFound("Report not found");

        return report;
    }

    public async removeReport(id: string): Promise<boolean> {
        id = id.toLowerCase();
        const report = await this.repository.findOne({ where: { id: id } });
        if (!report)
            throw new NotFound("Report not found");

        await this.repository.remove(report);
        return true;
    }
}