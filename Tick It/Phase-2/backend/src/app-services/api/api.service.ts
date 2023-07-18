import { Service } from "@tsed/di";
import { envs } from "../../config/envs";
import axios from "axios";

@Service()
export class ApiService {
  public async getTickets(filter: string) {
    return await axios.get(`${envs.BLOCKSYNC_HOST}/tokenOwnerships`, { params: { filter } });
  }
}
