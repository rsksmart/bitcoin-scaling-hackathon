import { Service } from "@tsed/di";
import { EventQueueService } from "../queues/event.queue";

@Service()
export class EventWorkerService {
    private eventQueueService: EventQueueService;
    constructor(eventQueueService: EventQueueService) {
        this.eventQueueService = eventQueueService;

        // Initialize processes and listeners
        this.initialize();
        this.addListeners();
    }

    private initialize = async () => { }

    private addListeners = async () => {
        this.eventQueueService.queue.on('completed', function (job, result) {
            console.log(`>_ Event Queue: Job ${job.name} completed successfully`);
            job.remove();
        });

        this.eventQueueService.queue.on('failed', (job, error) => {
            console.log(`>_ Event Queue: Job ${job.name} has failed: ${error}`)
        });
    }
}