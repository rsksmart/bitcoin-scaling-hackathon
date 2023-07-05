import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import chevronUp from '../svg/chevron-up.svg';
import { networkIcons } from '../utils/constants';
import './network.css';

export function Network() {
  const { isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  if (isConnected && switchNetwork && chain) {
    const icon = networkIcons[chain.id];

    return (
      <div className="header-item">
        <div className="dropdown-head">
          {icon && <img width="18" src={icon} alt={chain.name} />}{' '}
          {chain.unsupported ? (
            <span>
              <FontAwesomeIcon icon={faExclamationTriangle} /> Unsupported
            </span>
          ) : (
            <p>{chain.name}</p>
          )}
          <button className="arrow arrow-down">
            <img src={chevronUp} alt="" />
          </button>
        </div>
        <div className="dropdown-body">
          {chains
            .filter((chain) => [471100].indexOf(chain.id) >= 0)
            .map((chain) => (
              <button
                className="hbutton hbutton-lnk"
                style={{ paddingLeft: 0, textTransform: 'none' }}
                key={chain.id}
                onClick={() => switchNetwork(chain.id)}
              >
                <img width="18" src={networkIcons[chain.id]} alt={chain.name} />
                &nbsp;
                {chain.name}
              </button>
            ))}
        </div>
      </div>
    );
  }

  return <></>;
}
