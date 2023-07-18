import { registerProvider } from "@tsed/di";
import { ReportType } from "../../models/report-type";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";

export const ReportTypeRepository = PostgresDataSource.getRepository(ReportType);

export const REPORT_TYPE_REPOSITORY = Symbol.for("ReportTypeRepository");
export type REPORT_TYPE_REPOSITORY = typeof ReportTypeRepository;

registerProvider({
    provide: REPORT_TYPE_REPOSITORY,
    useValue: ReportTypeRepository
});