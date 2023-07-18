import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { MemberRole } from "../../models/member-role";

export const MemberRoleRepository = PostgresDataSource.getRepository(MemberRole);

export const MEMBER_ROLE_REPOSITORY = Symbol.for("MemberRoleRepository");
export type MEMBER_ROLE_REPOSITORY = typeof MemberRoleRepository;

registerProvider({
    provide: MEMBER_ROLE_REPOSITORY,
    useValue: MemberRoleRepository
});