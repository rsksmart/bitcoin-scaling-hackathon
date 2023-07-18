import dotenv from "dotenv";

export const envs = {
  ...process.env,
  ...dotenv.config().parsed,
};

export const isRSK = envs.IS_RSK;
export const isProduction = envs.NODE_ENV === "production";

export const LaunchpadAddress = isRSK
  ? isProduction
    ? envs.RSK_LAUNCHPAD_ADDRESS
    : envs.RSK_TESTNET_LAUNCHPAD_ADDRESS
  : isProduction
  ? envs.MAINNET_LAUNCHPAD_ADDRESS
  : envs.SEPOLIA_LAUNCHPAD_ADDRESS;
