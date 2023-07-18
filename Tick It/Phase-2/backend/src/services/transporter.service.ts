import { Service } from "@tsed/di";
import nodemailer, { Transporter } from "nodemailer"
import { envs } from "../config/envs";

@Service()
export class TransporterService {
    public transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: envs.TRANSPORTER_EMAIL,
                pass: envs.TRANSPORTER_PASSWORD,
            },
        })
    }

    public sendEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
        this.transporter.sendMail({ from: envs.TRANSPORTER_EMAIL, to, subject, html })
            .then(() => { })
            .catch((err) => { console.log("Error: ", err) });
    }
}