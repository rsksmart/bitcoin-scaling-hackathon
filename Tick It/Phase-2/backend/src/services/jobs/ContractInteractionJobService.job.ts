import { Inject, Service } from "@tsed/di";
import { RpcProviderService } from "../rpc-provider.service";
import { envs, isProduction, isRSK } from "../../config/envs";
import { Transaction } from "@ethereumjs/tx";
import Common from "@ethereumjs/common";
import { Chain } from "@ethereumjs/common";
import NFTix721 from "../../abis/NFTix721.json";
var Web3 = require("web3");

@Service()
export class ContractInteractionJobService {
  @Inject(RpcProviderService)
  protected rpcProviderService: RpcProviderService;

  public async custodialMint(address: string, callData: any) {
    const web3 = new Web3(this.rpcProviderService.web3Provider);
    const privateKey = Buffer.from(envs.MINTER_PRIVATE_KEY as string, "hex");
    web3.eth.defaultAccount = envs.MINTER_WALLET;
    const CONTRACT = new web3.eth.Contract(NFTix721.abi, address);
    const data = CONTRACT.methods.mint(callData[0], [], callData[1]).encodeABI();
    const txCount = await web3.eth.getTransactionCount(envs.MINTER_WALLET);
    const totalPrice = await callData[1].reduce(
      async (total: number, quantity: number, index: number) => {
        const type = await CONTRACT.methods.ticketTypes(index).call();
        return total + quantity * Number(type.price);
      },
      0,
    );
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      to: address,
      value: web3.utils.toHex(totalPrice),
      gasLimit: web3.utils.toHex(200000),
      gasPrice: web3.utils.toHex(await this.rpcProviderService.ethersProvider.getGasPrice()),
      data: data,
    };
    const common = isRSK
      ? Common.custom(
          isProduction
            ? { name: "RSK Mainnet", chainId: 30 }
            : { name: "RSK Testnet", chainId: 31 },
        )
      : new Common({ chain: isProduction ? Chain.Mainnet : Chain.Sepolia });
    const tx = new Transaction(txObject, { common });
    var signedTx = tx.sign(privateKey);
    var serializedTx = signedTx.serialize();
    const raw = "0x" + serializedTx.toString("hex");
    try {
      web3.eth.sendSignedTransaction(raw, (err: any, tx: any) => {
        if (err) {
          console.log(" --------------- ERROR IN CUSTODIAL MINT: ", err);
        } else
          console.log(
            " -------------------------- CUSTODIAL MINT COMPLETED -------------------------- ",
          );
      });
    } catch (err) {
      console.log(" --------------- Custodial Mint Transaction Failed: ", err);
    }
  }

  public async callContractMethod(
    abi: any,
    address: string,
    _privateKey: string,
    _publicKey: string,
    method: string,
    callData: any[],
    value: string,
  ) {
    const web3 = new Web3(this.rpcProviderService.web3Provider);
    const privateKey = Buffer.from(_privateKey as string, "hex");
    web3.eth.defaultAccount = _publicKey;
    const CONTRACT = new web3.eth.Contract(abi, address);
    const data = CONTRACT.methods[method](...callData).encodeABI();
    const txCount = await web3.eth.getTransactionCount(_publicKey);
    const txObject = {
      nonce: web3.utils.toHex(txCount),
      to: address,
      value: web3.utils.toHex(value),
      gasLimit: web3.utils.toHex(200000),
      gasPrice: web3.utils.toHex(await this.rpcProviderService.ethersProvider.getGasPrice()),
      data: data,
    };
    const common = isRSK
      ? Common.custom(
          isProduction
            ? { name: "RSK Mainnet", chainId: 30 }
            : { name: "RSK Testnet", chainId: 31 },
        )
      : new Common({ chain: isProduction ? Chain.Mainnet : Chain.Sepolia });
    const tx = new Transaction(txObject, { common });
    var signedTx = tx.sign(privateKey);
    var serializedTx = signedTx.serialize();
    const raw = "0x" + serializedTx.toString("hex");
    try {
      web3.eth.sendSignedTransaction(raw, (err: any, tx: any) => {
        if (err) {
          console.log(" --------------- ERROR IN SENDING TRANSACTION: ", err);
        } else console.log(" --------------- TRANSACTION COMPLETED --------------- ");
      });
    } catch (err) {
      console.log(" --------------- TRANSACTION FAILED: ", err);
    }
  }
}
