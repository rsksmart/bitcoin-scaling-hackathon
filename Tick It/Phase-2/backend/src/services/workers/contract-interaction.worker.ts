import { Service } from "@tsed/di";
import { ContractInteractionQueueService } from "../queues/contract-interaction.queue";
import { ContractInteractionJobService } from "../jobs/ContractInteractionJobService.job";

@Service()
export class ContractInteractionWorkerService {
  private contractInteractionQueueService: ContractInteractionQueueService;
  private contractInteractionJobService: ContractInteractionJobService;

  constructor(
    contractInteractionQueueService: ContractInteractionQueueService,
    contractInteractionJobService: ContractInteractionJobService,
  ) {
    this.contractInteractionQueueService = contractInteractionQueueService;
    this.contractInteractionJobService = contractInteractionJobService;

    // Initialize processes and listeners
    this.initialize();
    this.addListeners();
  }

  private initialize = async () => {
    this.contractInteractionQueueService.queue.process("custodialMint", async (job) => {
      await this.contractInteractionJobService.custodialMint(job.data.address, job.data.callData);
    });

    this.contractInteractionQueueService.queue.process("callContractMethod", async (job) => {
      await this.contractInteractionJobService.callContractMethod(
        job.data.abi,
        job.data.address,
        job.data.privateKey,
        job.data.publicKey,
        job.data.method,
        job.data.callData,
        job.data.value,
      );
    });
  };

  private addListeners = async () => {
    this.contractInteractionQueueService.queue.on("completed", function (job, result) {
      console.log(`>_ Contract Interaction Queue: Job ${job.name} completed successfully`);
      job.remove();
    });

    this.contractInteractionQueueService.queue.on("failed", (job, error) => {
      console.log(`>_ Contract Interaction Queue: Job ${job.name} has failed: ${error}`);
    });
  };
}
