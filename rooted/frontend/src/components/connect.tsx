import { faLink, faWallet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useNetwork
} from 'wagmi';

import './network.css';

import chevronUp from '../svg/chevron-up.svg';
import metamaskLogo from '../svg/metamask.svg';
import walletConnectLogo from '../svg/walletconnect.svg';

import { formatEtherTruncated } from '../utils/format';

export function Connect() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address, watch: true, cacheTime: 3_500 });
  // const { data: ensAvatar } = useEnsAvatar({ address, chainId: 1 });
  // const { data: ensName } = useEnsName({ address, chainId: 1 });
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();

  const [metamask, walletConnect] = connectors;

  const shortAddress = address
    ? `${address.substring(0, 6)}…${address.substring(address.length - 4)}`
    : '-';

  if (isConnected) {
    return (
      <div className="header-item">
        <div className="dropdown-head">
          <span>
            <FontAwesomeIcon icon={faWallet} />
            &nbsp;
            {shortAddress}
          </span>
          <button className="arrow arrow-down">
            <img src={chevronUp} alt="" />
          </button>
        </div>
        <div className="dropdown-body">
          <a
            href={`https://explorer.testnet.rsk.co/address/${address}`}
            target="_blank"
            rel="noreferrer"
            className="text"
          >
            {balance
              ? `${formatEtherTruncated(balance?.value)} ${
                  chain?.nativeCurrency.symbol
                }`
              : '...'}
          </a>
          <button
            className="hbutton hbutton-lnk"
            style={{ paddingLeft: 0, textTransform: 'none' }}
            onClick={() => disconnect()}
          >
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="header-item" id="connect-menu">
      <div className="dropdown-head">
        <span className="link">
          Connect wallet&nbsp;
          <FontAwesomeIcon icon={faLink} />
        </span>
      </div>
      <div className="dropdown-body">
        <button
          className="hbutton hbutton-lnk"
          disabled={!metamask.ready}
          key={metamask.id}
          style={{ textTransform: 'none' }}
          onClick={() => connect({ connector: metamask })}
        >
          <img src={metamaskLogo} alt="" width={24} />
          <span>
            MetaMask
            {isLoading &&
              metamask.id === pendingConnector?.id &&
              ' (connecting)'}
          </span>
        </button>

        <button
          className="hbutton hbutton-lnk"
          disabled={!walletConnect.ready}
          key={walletConnect.id}
          style={{ textTransform: 'none' }}
          onClick={() => connect({ connector: walletConnect })}
        >
          <img src={walletConnectLogo} alt="" width={24} />
          <span>
            Wallet Connect
            {isLoading &&
              walletConnect.id === pendingConnector?.id &&
              ' (connecting)'}
          </span>
        </button>

        {error && <p className="message error">{error.message}</p>}
      </div>
    </div>
  );
}
