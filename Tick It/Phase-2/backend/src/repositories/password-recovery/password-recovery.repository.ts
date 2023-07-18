import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { PasswordRecovery } from "../../models/password-recovery";

export const PasswordRecoveryRepository = PostgresDataSource.getRepository(PasswordRecovery);

export const PASSWORD_RECOVERY_REPOSITORY = Symbol.for("PasswordRecoveryRepository");
export type PASSWORD_RECOVERY_REPOSITORY = typeof PasswordRecoveryRepository;

registerProvider({
    provide: PASSWORD_RECOVERY_REPOSITORY,
    useValue: PasswordRecoveryRepository
});