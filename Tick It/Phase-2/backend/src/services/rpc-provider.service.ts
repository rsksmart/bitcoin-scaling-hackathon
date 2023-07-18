import { Service } from "@tsed/di";
import * as ethers from "ethers";
import { isRSK, isProduction, envs } from "../config/envs";
var Web3 = require("web3");

@Service()
export class RpcProviderService {
  public ethersProvider: ethers.providers.InfuraProvider | ethers.providers.JsonRpcProvider;
  public web3Provider: any;

  constructor() {
    this.ethersProvider = isRSK
      ? new ethers.providers.JsonRpcProvider(isProduction ? envs.RSKRpc : envs.RSKTestnetRpc)
      : new ethers.providers.InfuraProvider(isProduction ? "homestead" : "sepolia");

    this.web3Provider = new Web3.providers.HttpProvider(
      isRSK
        ? isProduction
          ? envs.RSKRpc
          : envs.RSKTestnetRpc
        : isProduction
        ? `https://mainnet.infura.io/v3/${envs.INFURA_KEY}`
        : `https://sepolia.infura.io/v3/${envs.INFURA_KEY}`,
    );
  }
}
