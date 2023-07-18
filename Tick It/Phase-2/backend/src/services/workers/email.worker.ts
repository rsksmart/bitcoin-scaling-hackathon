import { Service } from "@tsed/di";
import { TransporterService } from "../transporter.service";
import { EmailQueueService } from "../queues/email.queue";

@Service()
export class EmailWorkerService {
    private emailQueueService: EmailQueueService;
    private transporterService: TransporterService;

    constructor(emailQueueService: EmailQueueService, transporterService: TransporterService) {
        this.emailQueueService = emailQueueService;
        this.transporterService = transporterService;

        // Initialize processes and listeners
        this.initialize();
        this.addListeners();
    }

    private initialize = async () => {
        this.emailQueueService.queue.process('verificationEmail', async (job) => {
            const html = '<p>Verify your email</p>'
            await this.transporterService.sendEmail({ html, subject: "Tick-it: Verify Your Account!", to: job.data.email })
        });

        this.emailQueueService.queue.process('changedPasswordEmail', async (job) => {
            const html = '<p>Password Changed</p>'
            await this.transporterService.sendEmail({ html, subject: "Tick-it: Account Password Changed!", to: job.data.email })
        });

        this.emailQueueService.queue.process('passwordRecoveryEmail', async (job) => {
            const html = `<p>Password Recovery <b>${job.data.token}</b></p>`
            await this.transporterService.sendEmail({ html, subject: "Tick-it: Account Password Changed!", to: job.data.email })
        });
    }

    private addListeners = async () => {
        this.emailQueueService.queue.on('completed', function (job, result) {
            console.log(`>_ Email Queue: Job ${job.name} completed successfully`);
            job.remove();
        });

        this.emailQueueService.queue.on('failed', (job, error) => {
            console.log(`>_ Email Queue: Job ${job.name} has failed: ${error}`)
        });
    }
}