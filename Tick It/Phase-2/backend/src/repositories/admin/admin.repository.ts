import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { Admin } from "../../models/admin";

export const AdminRepository = PostgresDataSource.getRepository(Admin);

export const ADMIN_REPOSITORY = Symbol.for("AdminRepository");
export type ADMIN_REPOSITORY = typeof AdminRepository;

registerProvider({
    provide: ADMIN_REPOSITORY,
    useValue: AdminRepository
});