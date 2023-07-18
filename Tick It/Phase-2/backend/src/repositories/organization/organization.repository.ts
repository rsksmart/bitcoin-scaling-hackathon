import { registerProvider } from "@tsed/di";
import { Organization } from "../../models/organization";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";

export const OrganizationRepository = PostgresDataSource.getRepository(Organization);

export const ORGANIZATION_REPOSITORY = Symbol.for("OrganizationRepository");
export type ORGANIZATION_REPOSITORY = typeof OrganizationRepository;

registerProvider({
    provide: ORGANIZATION_REPOSITORY,
    useValue: OrganizationRepository
});