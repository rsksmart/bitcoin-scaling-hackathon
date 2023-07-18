import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { Report } from "../../models/report";

export const ReportRepository = PostgresDataSource.getRepository(Report);

export const REPORT_REPOSITORY = Symbol.for("ReportRepository");
export type REPORT_REPOSITORY = typeof ReportRepository;

registerProvider({
    provide: REPORT_REPOSITORY,
    useValue: ReportRepository
});