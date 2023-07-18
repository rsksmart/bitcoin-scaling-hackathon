import { Inject, Service } from "@tsed/di";
import { NotFound, Unauthorized } from "@tsed/exceptions";
import {
  SendTransactionRequest,
  SignMessageRequest,
  SignTransactionRequest,
} from "../../dtos/request/custodial.request";
import { WalletType } from "../../models/wallet";
import { EncryptionService } from "../encryption/encryption.service";
import { ContractInteractionQueueService } from "../../services/queues/contract-interaction.queue";
import { WalletService } from "../wallet/wallet.service";
import { RpcProviderService } from "../../services/rpc-provider.service";
import { User } from "../../models/user";
import * as ethers from "ethers";

@Service()
export class CustodialService {
  @Inject(WalletService)
  protected walletService: WalletService;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  @Inject(RpcProviderService)
  protected rpcProviderService: RpcProviderService;

  @Inject(ContractInteractionQueueService)
  protected contractInteractionQueueService: ContractInteractionQueueService;

  public async signMessage(user: User, payload: SignMessageRequest): Promise<string> {
    if (!user) throw new Unauthorized("User is not authorized to call this method");

    const [wallet] = await this.walletService.getWallets({
      where: { userId: user.id, type: WalletType.CUSTODIAL },
    });
    if (!wallet) throw new NotFound("Wallet not found");

    const phrase = this.encryptionService.aesDecrypt(wallet.phrase, user.email);
    const signer = ethers.Wallet.fromMnemonic(phrase);

    return await signer.signMessage(payload.message);
  }

  public async signTransaction(user: User, payload: SignTransactionRequest): Promise<string> {
    if (!user) throw new Unauthorized("User is not authorized to call this method");

    const [wallet] = await this.walletService.getWallets({
      where: { userId: user.id, type: WalletType.CUSTODIAL },
    });
    if (!wallet) throw new NotFound("Wallet not found");

    const phrase = this.encryptionService.aesDecrypt(wallet.phrase, user.email);
    const signer = ethers.Wallet.fromMnemonic(phrase);

    if (!payload.nonce) payload.nonce = await signer.getTransactionCount();
    if (!payload.value) payload.value = ethers.utils.parseEther("0");

    return await signer.signTransaction(payload);
  }

  public async sendTransaction(user: User, payload: SendTransactionRequest): Promise<boolean> {
    if (!user) throw new Unauthorized("User is not authorized to call this method");

    const [wallet] = await this.walletService.getWallets({
      where: { userId: user.id, type: WalletType.CUSTODIAL },
    });
    if (!wallet) throw new NotFound("Wallet not found");

    const phrase = this.encryptionService.aesDecrypt(wallet.phrase, user.email);
    const signer = new ethers.Wallet(phrase, this.rpcProviderService.ethersProvider);

    await this.contractInteractionQueueService.queue.add("callContractMethod", {
      address: payload.contractAddress,
      abi: payload.abi,
      signer,
      method: payload.method,
      callData: payload.callData,
      options: payload.options,
    });

    return true;
  }
}
