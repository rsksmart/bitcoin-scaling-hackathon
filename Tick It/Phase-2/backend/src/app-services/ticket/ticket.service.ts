import { Inject, Service } from "@tsed/di";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { ContractInteractionQueueService } from "../../services/queues/contract-interaction.queue";
import { MintTicketRequest, TransferTicketRequest } from "../../dtos/request/ticket.request";
import { NotFound, Unauthorized } from "@tsed/exceptions";
import { WalletService } from "../wallet/wallet.service";
import { WalletType } from "../../models/wallet";
import { EventService } from "../event/event.service";
import { User } from "../../models/user";
import NFTix721 from "../../abis/NFTix721.json";
import * as ethers from "ethers";
import { EncryptionService } from "../encryption/encryption.service";
import { ApiService } from "../api/api.service";

@Service()
export class TicketService {
  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

  @Inject(WalletService)
  protected walletService: WalletService;

  @Inject(EventService)
  protected eventService: EventService;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  @Inject(ContractInteractionQueueService)
  protected contractInteractionQueueService: ContractInteractionQueueService;

  @Inject(ApiService)
  protected apiService: ApiService;

  public async getTickets(address: string, isContract: boolean): Promise<any> {
    return this.apiService.getTickets(
      JSON.stringify({
        relations: ["token"],
        where: isContract
          ? { token: { contractId: address.toLowerCase() } }
          : { walletAddress: address.toLowerCase() },
      }),
    );
  }

  public async mintTicket(user: User, payload: MintTicketRequest): Promise<boolean> {
    if (!user) throw new Unauthorized("User is not authorized to call this method");

    const [wallet] = await this.walletService.getWallets({
      where: { userId: user.id, type: WalletType.CUSTODIAL },
    });
    if (!wallet) throw new NotFound("Wallet not found");

    const [event] = await this.eventService.getEvents({
      where: { contractAddress: payload.contractAddress },
    });
    if (!event) throw new NotFound("Event not found");

    await this.contractInteractionQueueService.queue.add("custodialMint", {
      address: event.contractAddress,
      callData: [wallet.address, payload.ticketTypeCounts],
    });

    return true;
  }

  public async transferTicket(user: User, payload: TransferTicketRequest): Promise<boolean> {
    if (!user) throw new Unauthorized("User is not authorized to call this method");

    const [wallet] = await this.walletService.getWallets({
      where: { userId: user.id, type: WalletType.CUSTODIAL },
    });
    if (!wallet) throw new NotFound("Wallet not found");

    const [event] = await this.eventService.getEvents({ where: { id: payload.eventId } });
    if (!event) throw new NotFound("Event not found");

    const phrase = this.encryptionService.aesDecrypt(wallet.phrase, user.email);

    const signer = ethers.Wallet.fromMnemonic(phrase);

    await this.contractInteractionQueueService.queue.add("callContractMethod", {
      abi: NFTix721.abi,
      address: event.contractAddress,
      privateKey: signer.privateKey,
      publicKey: signer.address,
      method: "safeTransferFrom",
      callData: [signer.address, payload.address, payload.tokenId],
      value: "0",
    });

    return true;
  }
}
