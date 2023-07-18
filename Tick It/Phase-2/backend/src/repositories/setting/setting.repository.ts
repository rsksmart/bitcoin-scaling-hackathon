import { registerProvider } from "@tsed/di";
import { Setting } from "../../models/setting";
import { PostgresDataSource } from "../../datasources/PostgresDatasource";

export const SettingRepository = PostgresDataSource.getRepository(Setting);

export const SETTING_REPOSITORY = Symbol.for("SettingRepository");
export type SETTING_REPOSITORY = typeof SettingRepository;

registerProvider({
    provide: SETTING_REPOSITORY,
    useValue: SettingRepository
});