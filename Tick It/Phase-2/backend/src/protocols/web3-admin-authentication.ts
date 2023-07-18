import { Web3Strategy } from "@cryptogate/passport-web3-strategy"
import { Req } from "@tsed/common"
import { Inject } from "@tsed/di"
import { Unauthorized } from "@tsed/exceptions"
import { OnVerify, Protocol } from "@tsed/passport"
import { BodyParams, HeaderParams } from "@tsed/platform-params"
import { Any } from "@tsed/schema"
import { ADMIN_REPOSITORY } from "../repositories/admin/admin.repository"

@Protocol({
    name: "web3Admin",
    useStrategy: Web3Strategy,
    settings: {
        name: 'web3Admin'
    }
})
export class Web3AdminProtocol implements OnVerify {

    @Inject(ADMIN_REPOSITORY)
    private adminRepository: ADMIN_REPOSITORY

    async $onVerify(@Req() request: Req, @HeaderParams() credentials: any, @BodyParams() @Any() body: any) {

        let isEvm = credentials["x-web3-auth-isevm"] != null ? credentials["x-web3-auth-isevm"] : body.isevm
        let chain = credentials["x-web3-auth-chain"] != null ? credentials["x-web3-auth-chain"] : body.chain
        let msg = credentials["x-web3-auth-msg"] != null ? credentials["x-web3-auth-msg"] : body.msg
        let signed = credentials["x-web3-auth-signed"] != null ? credentials["x-web3-auth-signed"] : body.signed
        let address = credentials["x-web3-auth-address"] != null ? credentials["x-web3-auth-address"].toLowerCase() : body.address.toLowerCase()

        if (address && isEvm && chain && msg && signed) {
            let admin = await this.adminRepository.findOneBy({ id: address, isActive: true });
            if (admin) {
                return request.user = { ...admin };
            } else {
                throw new Unauthorized("Wallet not allowed");
            }
        } else {
            throw new Unauthorized("Error: Missing Credentials")
        }
    }
}