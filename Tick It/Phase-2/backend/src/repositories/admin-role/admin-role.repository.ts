import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { AdminRole } from "../../models/admin-role";

export const AdminRoleRepository = PostgresDataSource.getRepository(AdminRole);

export const ADMIN_ROLE_REPOSITORY = Symbol.for("AdminRoleRepository");
export type ADMIN_ROLE_REPOSITORY = typeof AdminRoleRepository;

registerProvider({
    provide: ADMIN_ROLE_REPOSITORY,
    useValue: AdminRoleRepository
});