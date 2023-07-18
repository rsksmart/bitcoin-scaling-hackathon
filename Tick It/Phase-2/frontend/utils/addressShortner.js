const Shortner = (walletAddress) => {
  let formattedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(
    -3
  )}`;
  return formattedAddress;
};
export default Shortner;
