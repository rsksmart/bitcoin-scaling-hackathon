import { Service } from "@tsed/di";
import Bull, { Queue } from "bull";
import { _connectionOpts } from "../../config/ioredis";

@Service()
export class EmailQueueService {
    public queue: Queue;

    constructor() {
        this.queue = new Bull("email", { redis: _connectionOpts });
    }
}