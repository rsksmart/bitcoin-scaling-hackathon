import { Inject, Service } from "@tsed/di";
import { LinkWalletRequest, WalletRequest } from "../../dtos/request/wallet.request";
import { WalletResponse } from "../../dtos/response/wallet.response";
import { WalletType } from "../../models/wallet";
import { WALLET_REPOSITORY } from "../../repositories/wallet/wallet.repository";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { InternalServerError, NotFound, Unauthorized } from "@tsed/exceptions";
import * as ethers from "ethers";
import { EncryptionService } from "../encryption/encryption.service";
import { User } from "../../models/user";

@Service()
export class WalletService {
  @Inject(WALLET_REPOSITORY)
  protected repository: WALLET_REPOSITORY;

  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  public async getWallets(filter?: any): Promise<Array<WalletResponse>> {
    const wallets = filter ? await this.repository.find(filter) : await this.repository.find();
    if (!wallets) return [];
    return wallets;
  }

  public async createWallet(payload: WalletRequest): Promise<WalletResponse> {
    return await this.repository.save({ ...payload });
  }

  public async linkWallet(user: User, payload: LinkWalletRequest): Promise<WalletResponse> {
    const wallet = await this.repository.findOne({
      where: { userId: user.id, address: payload.address, type: WalletType.PRIVATE },
    });

    if (wallet) return wallet;

    return await this.repository.save({ userId: user.id, address: payload.address });
  }

  public async updateWallet(id: string, payload: WalletRequest): Promise<WalletResponse> {
    await this.repository.update({ id: id }, { ...payload });

    const wallet = await this.repository.findOne({ where: { id: id } });
    if (!wallet) throw new NotFound("Wallet not found");

    return wallet;
  }

  public async unlinkWallet(user: User, id: string): Promise<boolean> {
    const wallet = await this.repository.findOne({ where: { id: id } });

    if (!wallet) throw new NotFound("Wallet not found");
    if (wallet.userId != user.id) throw new Unauthorized("Unauthorized action");

    await this.repository.remove(wallet);
    return true;
  }

  public async removeWallet(id: string): Promise<boolean> {
    const wallet = await this.repository.findOne({ where: { id: id } });
    if (!wallet) throw new NotFound("Wallet not found");

    await this.repository.remove(wallet);
    return true;
  }

  public generateHDNode(): any {
    const mnemonic = ethers.Wallet.createRandom().mnemonic;
    try {
      const HDNode = ethers.utils.HDNode.fromMnemonic(mnemonic.phrase);
      return HDNode
        ? {
            address: HDNode.address,
            mnemonic: HDNode.mnemonic,
          }
        : null;
    } catch (e) {
      return null;
    }
  }

  public async generateCustodialWallet(userId: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFound("User not found");

    const HDNode = this.generateHDNode();
    if (!HDNode) throw new InternalServerError("Failed to generate wallet");

    const encryptedSeedPhrase = this.encryptionService.aesEncrypt(
      HDNode.mnemonic.phrase,
      user.email,
    );

    await this.repository.save({
      userId,
      address: HDNode.address,
      type: WalletType.CUSTODIAL,
      phrase: encryptedSeedPhrase,
    });

    return HDNode.address;
  }
}
