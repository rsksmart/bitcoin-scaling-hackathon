import { envs } from "./envs";

export const _connectionOpts: any = {
    pkg: "ioredis",
    host: envs.REDIS_URL,
    username: envs.REDIS_USERNAME,
    password: envs.REDIS_PASSWORD,
    port: envs.REDIS_PORT,
    database: envs.REDIS_DATABASE,
    options: { password: envs.REDIS_PASSWORD }
};