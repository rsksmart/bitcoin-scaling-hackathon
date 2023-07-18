import { Inject, Service } from "@tsed/di";
import { BadRequest, NotFound, Unauthorized } from "@tsed/exceptions";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { PasswordRecoveryRequest, UpdatePasswordRequest } from "../../dtos/request/auth.request";
import { WalletService } from "../wallet/wallet.service";
import { PASSWORD_RECOVERY_REPOSITORY } from "../../repositories/password-recovery/password-recovery.repository";
import { StatusType } from "../../models/password-recovery";
import { EmailQueueService } from "../../services/queues/email.queue";
import { envs } from "../../config/envs";
import { EncryptionService } from "../encryption/encryption.service";
import { UserRequest } from "../../dtos/request/user.request";
import { UserResponse } from "../../dtos/response/user.response";
var jwt = require("jsonwebtoken");

@Service()
export class AuthService {
  @Inject(USER_REPOSITORY)
  protected userRepository: USER_REPOSITORY;

  @Inject(PASSWORD_RECOVERY_REPOSITORY)
  protected passwordRecoveryRepository: PASSWORD_RECOVERY_REPOSITORY;

  @Inject(WalletService)
  protected walletService: WalletService;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  @Inject(EmailQueueService)
  protected emailQueueService: EmailQueueService;

  public async signup(payload: UserRequest): Promise<UserResponse> {
    if (!payload.isOAuth && payload.email && payload.password) {
      payload.email = payload.email.toLowerCase();
      const encryptedPassword = this.encryptionService.md5Encrypt(payload.email + payload.password);
      payload.password = encryptedPassword;
    }

    let user = await this.userRepository.save({ ...payload });

    await this.emailQueueService.queue.add("verificationEmail", { email: user.email });

    await this.walletService.generateCustodialWallet(user.id);

    return user;
  }

  public async requestPasswordRecovery(payload: PasswordRecoveryRequest): Promise<Boolean> {
    if (!payload.email && !payload.username)
      throw new BadRequest("You need to provide either an email or a username");

    const user = await this.userRepository.findOne({
      where: [
        { email: payload.email?.toLowerCase(), isOAuth: false },
        { username: payload.username, isOAuth: false },
      ],
    });
    if (!user) throw new NotFound("User not found");

    var expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const token = this.encryptionService.aesEncrypt(
      JSON.stringify({ userId: user.id, expiresAt }),
      envs.PASSWORD_RECOVERY_KEY as string,
    );

    await this.passwordRecoveryRepository.save({ email: user.email, token });

    await this.emailQueueService.queue.add("passwordRecoveryEmail", { email: user.email, token });

    return true;
  }

  public async updatePassword(
    encryptedToken: string,
    payload: UpdatePasswordRequest,
  ): Promise<Boolean> {
    const token = await this.passwordRecoveryRepository.findOne({
      where: { token: encryptedToken, status: StatusType.PENDING },
    });
    if (!token) throw new NotFound("Pending request not found");

    const decodedToken = this.encryptionService.aesDecrypt(
      encryptedToken,
      envs.PASSWORD_RECOVERY_KEY as string,
    );

    const user = await this.userRepository.findOne({
      where: { id: decodedToken.userId, isOAuth: false },
    });

    if (!user) {
      await this.passwordRecoveryRepository.update(
        { id: token.id },
        { status: StatusType.ERRORED },
      );
      throw new NotFound("User not found");
    }

    if (decodedToken.expiresAt < new Date()) {
      await this.passwordRecoveryRepository.update(
        { id: token.id },
        { status: StatusType.EXPIRED },
      );
      throw new Unauthorized("This token is expired");
    }

    const encryptedPassword = this.encryptionService.md5Encrypt(user.email + payload.password);
    await this.userRepository.update({ id: user.id }, { password: encryptedPassword });

    await this.passwordRecoveryRepository.update(
      { id: token.id },
      { status: StatusType.COMPLETED },
    );

    await this.emailQueueService.queue.add("changedPasswordEmail", { email: user.email });

    return true;
  }
}
