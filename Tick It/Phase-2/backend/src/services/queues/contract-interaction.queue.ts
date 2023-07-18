import { Service } from "@tsed/di";
import Bull, { Queue } from "bull";
import { _connectionOpts } from "../../config/ioredis";

@Service()
export class ContractInteractionQueueService {
    public queue: Queue;

    constructor() {
        this.queue = new Bull("contract-interaction", { redis: _connectionOpts });
    }
}