import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { User } from "../../models/user";

export const UserRepository = PostgresDataSource.getRepository(User);

export const USER_REPOSITORY = Symbol.for("UserRepository");
export type USER_REPOSITORY = typeof UserRepository;

registerProvider({
    provide: USER_REPOSITORY,
    useValue: UserRepository
});