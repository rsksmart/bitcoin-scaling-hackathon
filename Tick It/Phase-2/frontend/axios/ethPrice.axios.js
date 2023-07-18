import axios from "axios";

export const getEthereumPrice = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    );
    const ethereumPrice = response.data.ethereum.usd;

    return ethereumPrice;
  } catch (error) {
    console.error("Error fetching Ethereum price:", error);
  }
};
