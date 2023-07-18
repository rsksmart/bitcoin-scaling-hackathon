import { Inject, Service } from "@tsed/di";
import { EmailWorkerService } from "./workers/email.worker";
import { EventWorkerService } from "./workers/event.worker";
import { ContractInteractionWorkerService } from "./workers/contract-interaction.worker";
import { LoginPassportProtocol } from "../protocols/login-passport.protocol";
import { SignupPassportProtocol } from "../protocols/signup-passport.protocol";
import { JwtPassportProtocol } from "../protocols/jwt-passport.protocol";
import { OAuthPassportProtocol } from "../protocols/oauth-passport.protocol";

@Service()
export class InjectorService {
  // ------------ Inject Workers ------------

  @Inject(ContractInteractionWorkerService)
  public contractInteractionWorkerService: ContractInteractionWorkerService;

  @Inject(EmailWorkerService)
  public emailWorkerService: EmailWorkerService;

  @Inject(EventWorkerService)
  public eventWorkerService: EventWorkerService;

  // ------------ Inject Protocols ------------

  @Inject(LoginPassportProtocol)
  public loginPassportProtocol: LoginPassportProtocol;

  @Inject(SignupPassportProtocol)
  public signupPassportProtocol: SignupPassportProtocol;

  @Inject(JwtPassportProtocol)
  public jwtPassportProtocol: JwtPassportProtocol;

  @Inject(OAuthPassportProtocol)
  public oAuthPassportProtocol: OAuthPassportProtocol;
}
