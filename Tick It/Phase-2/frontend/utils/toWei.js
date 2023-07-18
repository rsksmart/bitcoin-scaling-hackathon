export function toWei(ether) {
  const etherValue = BigInt(ether);
  const weiValue = etherValue * BigInt("1000000000000000000");
  return weiValue.toString();
}
