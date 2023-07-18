import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { OrganizationMember } from "../../models/organization-member";

export const OrganizationMemberRepository = PostgresDataSource.getRepository(OrganizationMember);

export const ORGANIZATION_MEMBER_REPOSITORY = Symbol.for("OrganizationMemberRepository");
export type ORGANIZATION_MEMBER_REPOSITORY = typeof OrganizationMemberRepository;

registerProvider({
    provide: ORGANIZATION_MEMBER_REPOSITORY,
    useValue: OrganizationMemberRepository
});