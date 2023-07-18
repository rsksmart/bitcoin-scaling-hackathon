import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";
import { Wallet } from "../../models/wallet";

export const WalletRepository = PostgresDataSource.getRepository(Wallet);

export const WALLET_REPOSITORY = Symbol.for("WalletRepository");
export type WALLET_REPOSITORY = typeof WalletRepository;

registerProvider({
    provide: WALLET_REPOSITORY,
    useValue: WalletRepository
});