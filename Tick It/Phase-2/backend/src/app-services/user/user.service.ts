import { Inject, Service } from "@tsed/di";
import { ChangePasswordRequest, UserRequest } from "../../dtos/request/user.request";
import { UserResponse } from "../../dtos/response/user.response";
import { User } from "../../models/user";
import { USER_REPOSITORY } from "../../repositories/user/user.repository";
import { Conflict, NotFound, Unauthorized } from "@tsed/exceptions";
import { EmailQueueService } from "../../services/queues/email.queue";
import { EncryptionService } from "../encryption/encryption.service";

@Service()
export class UserService {
  @Inject(USER_REPOSITORY)
  protected repository: USER_REPOSITORY;

  @Inject(EncryptionService)
  protected encryptionService: EncryptionService;

  @Inject(EmailQueueService)
  protected emailQueueService: EmailQueueService;

  public async getUsers(filter?: any): Promise<Array<UserResponse>> {
    const users = filter ? await this.repository.find(filter) : await this.repository.find();
    if (!users) return [];
    return users;
  }

  public async createUser(payload: UserRequest): Promise<UserResponse> {
    return await this.repository.save({ ...payload });
  }

  public async updateUser(user: User, payload: UserRequest): Promise<UserResponse> {
    if (!user) throw new NotFound("User not found");

    await this.repository.update({ id: user.id }, { ...payload });

    const dbUser = await this.repository.findOne({ where: { id: user.id } });
    if (!dbUser) throw new NotFound("User not found");

    return dbUser;
  }

  public async removeUser(user: User): Promise<boolean> {
    if (!user) throw new NotFound("User not found");

    const dbUser = await this.repository.findOne({ where: { id: user.id } });
    if (!dbUser) throw new NotFound("User not found");

    await this.repository.remove(dbUser);
    return true;
  }

  public async changePassword(user: User, payload: ChangePasswordRequest): Promise<boolean> {
    const encryptedOldPassword = this.encryptionService.md5Encrypt(
      user.email + payload.oldPassword,
    );

    if (user.password != encryptedOldPassword) throw new Unauthorized("Old password didn't match");
    const encryptedPassword = this.encryptionService.md5Encrypt(user.email + payload.newPassword);

    if (encryptedPassword == encryptedOldPassword)
      throw new Conflict("New password can't be the same as the old password");

    await this.repository.update({ id: user.id }, { password: encryptedPassword });

    await this.emailQueueService.queue.add("changedPasswordEmail", { email: user.email });

    return true;
  }
}
