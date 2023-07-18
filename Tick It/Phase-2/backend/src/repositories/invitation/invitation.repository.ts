import { registerProvider } from "@tsed/di";
import { Invitation } from "../../models/invitation";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";

export const InvitationRepository = PostgresDataSource.getRepository(Invitation);

export const INVITATION_REPOSITORY = Symbol.for("InvitationRepository");
export type INVITATION_REPOSITORY = typeof InvitationRepository;

registerProvider({
    provide: INVITATION_REPOSITORY,
    useValue: InvitationRepository
});