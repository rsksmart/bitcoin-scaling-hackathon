import { Service } from "@tsed/di";
import Bull, { Queue } from "bull";
import { _connectionOpts } from "../../config/ioredis";

@Service()
export class EventQueueService {
    public queue: Queue;

    constructor() {
        this.queue = new Bull("event", { redis: _connectionOpts });
    }
}