import { Chain } from 'wagmi'

export const rskTestnet = {
  id: 31,
  name: 'Rootstock Testnet',
  network: 'rsk-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Smart Bitcoin',
    symbol: 'RBTC',
  },
  rpcUrls: {
    default: { http: ['https://public-node.testnet.rsk.co'] },
    public: { http: ['https://public-node.testnet.rsk.co'] },
  },
  blockExplorers: {
    default: {
      name: 'Rootstock Testnet Explorer',
      url: 'https://explorer.testnet.rsk.co',
    },
  },
} as const satisfies Chain