import { registerProvider } from "@tsed/di";
import { DataSource } from "typeorm";
import { Logger } from "@tsed/logger";
import { envs } from "../config/envs";

export const POSTGRES_DATA_SOURCE = Symbol.for("PostgresDataSource");
export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: envs.POSTGRES_HOST,
  port: Number(envs.POSTGRES_PORT),
  username: envs.POSTGRES_USER,
  password: envs.POSTGRES_PASSWORD,
  database: envs.POSTGRES_DB,
  entities: [__dirname + "/../models/*{.ts,.js}"],
  logging: ["error"],
  logger: "file",
  synchronize: true,
});

registerProvider<DataSource>({
  provide: POSTGRES_DATA_SOURCE,
  type: "typeorm:datasource",
  deps: [Logger],
  async useAsyncFactory(logger: Logger) {
    await PostgresDataSource.initialize();

    logger.info("Connected with typeorm to database: Postgres");

    return PostgresDataSource;
  },
  hooks: {
    $onDestroy(dataSource) {
      return dataSource.isInitialized && dataSource.close();
    }
  }
});
