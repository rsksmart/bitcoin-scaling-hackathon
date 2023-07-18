export function fromWei(wei) {
  const weiValue = BigInt(wei);
  const etherValue = weiValue / BigInt("1000000000000000000");
  return etherValue.toString();
}
