import { getChainById, ChainId, EvmWallets } from "@cryptogate/react-providers";
import NFTix721 from "../abis/NFTix721.json";
import NFTixLaunchpad from "../abis/NFTixLaunchpad.json";
const ethConfig = {
  defaultNetwork: getChainById(ChainId.Sepolia),
  allowedNetworks: [
    getChainById(ChainId.Sepolia),
    getChainById(ChainId.RSKTestnet),
  ],
  contractList: [
    {
      name: "NFTix721",
      abi: NFTix721.abi,
      addresses: {
        [ChainId.Sepolia]:
          process.env.NEXT_PUBLIC_SEPOLIA_NFTIX721_CONTRACT_ADDRESS,
        [ChainId.RSKTestnet]:
          process.env.NEXT_PUBLIC_ROOTSTOCK_NFTIX721_CONTRACT_ADDRESS,
      },
    },
    {
      name: "NFTixLaunchpad",
      abi: NFTixLaunchpad.abi,
      addresses: {
        [ChainId.Sepolia]:
          process.env.NEXT_PUBLIC_SEPOLIA_LAUNCHPAD_CONTRACT_ADDRESS,
        [ChainId.RSKTestnet]:
          process.env.NEXT_PUBLIC_ROOTSTOCK_LAUNCHPAD_CONTRACT_ADDRESS,
      },
    },
  ],
  readOnlyUrls: {
    [ChainId.Sepolia]: `https://sepolia.infura.io/v3/98d5cf1c763f4224afa492b70366effa`,
    [ChainId.RSKTestnet]: `https://public-node.testnet.rsk.co`,
  },
  wallets: [
    EvmWallets.METAMASK,
    EvmWallets.BRAVEWALLET,
    EvmWallets.WALLETCONNECT,
    EvmWallets.COINBASE,
  ],
};
export default ethConfig;
