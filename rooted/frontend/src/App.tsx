// import '@coreui/coreui/dist/css/coreui.min.css';
import './App.css';

import { Main } from './pages/main';

import { configureChains, createClient, goerli, mainnet, WagmiConfig } from 'wagmi';
import { localhost } from 'wagmi/chains';
import { rskTestnet } from './utils/rskTestnet';

import { publicProvider } from 'wagmi/providers/public';

import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const { chains, provider, webSocketProvider } = configureChains(
  [ rskTestnet, mainnet, goerli, localhost],
  [publicProvider()]
);
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({ chains, options: {
    qrcode: true,
    // version: '1',
    //  projectId: process.env.REACT_APP_WALLET_CONNECT_ID || ''
    }}),
    /* new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }), */
  ],
  provider,
  webSocketProvider,
});

window.Buffer = window.Buffer || require('buffer').Buffer;

function App() {
  return (
    <>
      <WagmiConfig client={client}>
        <Main />
      </WagmiConfig>
    </>
  );
}

export default App;
