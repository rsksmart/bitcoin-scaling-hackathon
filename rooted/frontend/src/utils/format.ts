import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";

export function formatEtherTruncated(val: BigNumber, roundTo: number = 1e12) {
  return formatEther(val.sub(val.mod(roundTo)))
}