import {  Property } from "@tsed/schema";
import { BigNumberish } from "ethers";

export class SignMessageRequest {
    @Property()
    message: string;
}

export class SignTransactionRequest {
    @Property()
    from?: string

    @Property()
    to: string

    @Property()
    nonce?: number

    @Property()
    data: any

    @Property()
    value?: BigNumberish

    @Property()
    gasLimit: BigNumberish

    @Property()
    gasPrice: BigNumberish

    @Property()
    maxFeePerGas?: BigNumberish

    @Property()
    maxPriorityFeePerGas?: BigNumberish

    @Property()
    chainId?: number

    @Property()
    type?: number
}

export class SendTransactionRequest {
    @Property()
    contractAddress: string;

    @Property()
    abi: string;

    @Property()
    method: string;

    @Property()
    callData: any[];

    @Property()
    options: {
        gasLimit?: Number,
        gasPrice?: string,
        nounce?: Number,
        value?: string,
        chainId?: Number
    };
}