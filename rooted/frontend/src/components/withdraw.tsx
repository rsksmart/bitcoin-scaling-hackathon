import { useContext, useEffect, useMemo, useState } from 'react';
import { providers } from 'ethers';

import './panes.css';

import { StaticJsonRpcProvider } from '@ethersproject/providers';
import {
  faArrowRight,
  faArrowTurnDown,
  faCheckCircle,
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  fetchBalance,
  prepareSendTransaction,
  waitForTransaction
} from '@wagmi/core';
import { ec as EC } from 'elliptic';
import { BigNumber, ethers } from 'ethers';
import { formatEther, getAddress, keccak256 } from 'ethers/lib/utils';
import { useAccount, useContractRead, useNetwork } from 'wagmi';
import { default as REGISTRY_ABI } from '../abi/Registry.json';
import { copyTextToClipboard } from '../utils/clipboard';
import { registryAddress } from '../utils/constants';
import { formatEtherTruncated } from '../utils/format';
import { AddressContext, AddressContextType } from './address';

export function Withdraw() {
  const ec = useMemo(() => {
    return new EC('secp256k1');
  }, []);

  const { spendingKey } = useContext(AddressContext) as AddressContextType;

  const [keyAddrs, setKeyAddrs] = useState<Array<string[]>>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [active, setActive] = useState<any>({});
  const [targetAddr, setTargetAddr] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isAddressValid, setIsAddressValid] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState<string>();
  const [withdrawError, setWithdrawError] = useState<string>();
  const [txPending, setTxPending] = useState<string>('');

  const { chain } = useNetwork();
  const { isConnected, address, connector } = useAccount();

  const registryConfig = {
    address: registryAddress[chain?.id || 471100],
    abi: REGISTRY_ABI,
  };

  const [keysCount, setKeysCount] = useState<number>(0);
  const [keysIndex, setKeysIndex] = useState<number>(0);

  useEffect(() => {
    setKeyAddrs([]);
    setKeysIndex(0);
  }, [spendingKey, chain]);

  const { refetch: refetchKeys } = useContractRead({
    ...registryConfig,
    functionName: 'getNextKeys',
    args: [BigNumber.from(keysIndex)] as const,
    enabled: isConnected,
  });

  const { data: _keysCount, refetch: refetchKeysCount } = useContractRead({
    ...registryConfig,
    functionName: 'totalKeys',
    enabled: isConnected,
  });

  useEffect(() => {
    if (!isConnected || !!!_keysCount) return;

    setKeysCount((_keysCount as BigNumber).toNumber() || 0);
    const handler = setInterval(() => {
      refetchKeysCount().then((x) =>
        setKeysCount((x.data as BigNumber).toNumber())
      );
    }, 10000);

    return () => {
      clearInterval(handler);
    };
  }, [isConnected, chain, refetchKeysCount]);

  useEffect(() => {
    if (!keysCount || !spendingKey || !isConnected) return;

    console.log('Effect keys, idx: ' + keysIndex);

    refetchKeys().then((x) => {
      findMatch(x.data as Array<string[]>).then(() => {
        if (keysCount > keysIndex) {
          // delay between sequential calls
          setTimeout(() => {
            setKeysIndex(Math.min(keysCount, keysIndex + 10));
          }, 750);
        }
      });
    });
  }, [keysCount, refetchKeys, isConnected, spendingKey, keysIndex]);

  useEffect(() => {
    setTargetAddr('');
    setIsSending(false);
    setIsAddressValid(true);
    setWithdrawError(undefined);
    setWithdrawSuccess(undefined);
    setTxPending('');
  }, [modalVisible]);

  useEffect(() => {
    try {
      getAddress(targetAddr);
      setIsAddressValid(true);
    } catch (e) {
      setIsAddressValid(false);
    }
  }, [targetAddr]);

  const findMatch = async (keys: Array<string[]>) => {
    if (!spendingKey || !isConnected) return;

    const _addrs = await Promise.all(
      keys.map(async (key) => {
        const [_x, _y, _ss, token] = key;

        const x = parseInt(_x, 16);
        const y = parseInt(_y, 16);

        if (x === 0 || y === 0) return null;

        let eph;
        try {
          eph = ec.keyFromPublic(`04${_x.slice(2)}${_y.slice(2)}`, 'hex');
        } catch (e) {
          return null;
        }
        const ss = spendingKey.derive(eph.getPublic());

        // early check if shared secret might be the same
        if (ss.toArray()[0] !== parseInt(_ss, 16)) return null;

        const hashed = ec.keyFromPrivate(keccak256(ss.toArray()));
        const pub = spendingKey
          .getPublic()
          .add(hashed.getPublic())
          .encode('array', false);

        const _addr = keccak256(pub.splice(1));
        const addr = getAddress(
          '0x' + _addr.substring(_addr.length - 40, _addr.length)
        );

        if (token === ethers.constants.AddressZero) {
          const bal = await fetchBalance({ address: addr });
          console.log(addr, formatEther(bal.value));

          if (bal.value.gte(1e12)) {
            return [_x, _y, token, bal.value.toString(), addr];
          }
        } else {
          console.error("Token transfers aren't supported yet");
        }

        return null;
      })
    );

    const addrs = _addrs.filter((y) => y !== null);
    console.log('Found new keys: ' + addrs.length + ' from ' + keys.length);
    setKeyAddrs([...keyAddrs, ...(addrs as Array<string[]>)]);
  };

  const buildPrivateKey = (x: string, y: string, spendingKey: EC.KeyPair) => {
    const eph = ec.keyFromPublic(`04${x.slice(2)}${y.slice(2)}`, 'hex');

    const ss = spendingKey.derive(eph.getPublic());
    const hashed = ec.keyFromPrivate(keccak256(ss.toArray()));

    const _key = spendingKey.getPrivate().add(hashed.getPrivate());
    const key = _key.mod(ec.curve.n);

    return key;
  };

  const withdraw = async (
    x: string,
    y: string,
    token: string,
    addr: `0x${string}`,
    target: `0x${string}`
  ) => {
    if (!spendingKey) return;

    setIsSending(true);

    const bal = await fetchBalance({ address: addr });
    const key = buildPrivateKey(x, y, spendingKey);
    const config = await prepareSendTransaction({
      request: {
        to: target,
        value: bal.value,
      },
    });

    try {
      const provider = new StaticJsonRpcProvider(chain?.rpcUrls.public.http[0]);
      const signer = new ethers.Wallet(key.toArray(undefined, 32), provider);

      const gasLimit = config.request.gasLimit as BigNumber;
      //const gasLimit = ethers.BigNumber.from(21001);

      const connectedSigner = await connector?.getSigner();
      const gasPrice = await connectedSigner.getGasPrice();

      const fee = gasLimit.mul(gasPrice);
      /* .mul(BigNumber.from(3))
        .div(BigNumber.from(2)); */

      console.log(
        `Fee: ${fee.toNumber()}, gasLimit: ${gasLimit.toString()}, gasPrice: ${gasPrice.toString()}`
      );

      const originalBalance = config.request.value as BigNumber;

      config.request = {
        ...config.request,
        from: addr,
        value: originalBalance.sub(fee),
        gasPrice: gasPrice,
      };

      console.log(
        `Original balance: ${originalBalance}, sending: ${config.request.value}`
      );

      const result = await signer.sendTransaction(config.request);

      setTxPending(result.hash);

      const data = await waitForTransaction({
        hash: result.hash as `0x${string}`,
      });

      setTxPending('');
      setWithdrawSuccess(data.transactionHash);

      // exclude address from the list
      setKeyAddrs(keyAddrs.filter((p) => p[4] !== addr));
    } catch (e) {
      setWithdrawError((e as Error).message);
      setTxPending('');
    }

    setIsSending(false);
  };

  if (!isConnected) {
    return (
      <div className="lane">
        <p>
          <b
            onClick={() => {
              window.scrollTo({ top: 0 });
            }}
          >
            Connect wallet
          </b>{' '}
          to proceed.
        </p>
      </div>
    );
  } else {
    return (
      <div>
        {keyAddrs.length === 0 && !modalVisible && (
          <div className="lane" style={{ marginTop: '1rem' }}>
            <p className="message">Nothing to withdraw yet.</p>
          </div>
        )}

        {keyAddrs.length > 0 && !modalVisible && (
          <>
            <div className="lane" style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                {keyAddrs.map((s) => {
                  const [_x, _y, token, bal, addr] = s;
                  return (
                    <div
                      key={addr}
                      style={{
                        minHeight: '1.8rem',
                        margin: '0 1rem 0.75rem 0',
                      }}
                    >
                      <button
                        className="hbutton"
                        color="success"
                        onClick={(e) => {
                          e.preventDefault();
                          //
                          setActive({
                            x: _x,
                            y: _y,
                            token,
                            addr,
                            balance: bal,
                          });
                          setModalVisible(true);
                        }}
                      >
                        {formatEtherTruncated(BigNumber.from(bal))}{' '}
                        {chain?.nativeCurrency.symbol}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div className={modalVisible ? 'modal active' : 'modal'}>
          <div className="lane" style={{ marginTop: '1rem' }}>
            <div className="modal-window">
              <h2 style={{ fontWeight: 'normal', height: '44px' }}>
                Withdraw {formatEther(active.balance || '0')}{' '}
                {chain?.nativeCurrency.symbol}
              </h2>

              <button
                className="hbutton hbutton-lnk"
                style={{
                  paddingLeft: 0,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setModalVisible(false);
                }}
              >
                back to list
              </button>
            </div>
          </div>
          <div className="lane" style={{ marginTop: '0.5rem' }}>
            <form
              onSubmit={() => {
                return false;
              }}
            >
              <div className="input-container">
                <input
                  type="text"
                  id="targetAddr"
                  value={targetAddr}
                  className={!isAddressValid ? 'error-input' : ''}
                  spellCheck="false"
                  autoComplete="off"
                  placeholder="0x943sI865PYt2W..."
                  disabled={isSending}
                  onChange={(e) => {
                    setIsAddressValid(true);
                    setTargetAddr(e.target.value);
                  }}
                />
                <label htmlFor="targetAddr">To address</label>
              </div>
              <div className="lane" style={{ marginTop: '0.5rem' }}>
                <button
                  className="hbutton hbutton-lnk"
                  style={{
                    fontSize: '87.5%',
                    paddingLeft: 0,
                    paddingTop: 0,
                    textTransform: 'lowercase',
                  }}
                  disabled={isSending}
                  onClick={(e) => {
                    e.preventDefault();
                    setTargetAddr(address || '');
                  }}
                >
                  use connected wallet
                </button>
              </div>
            </form>
          </div>

          {!!spendingKey && (
            <div className="lane" style={{ marginTop: '1.25rem' }}>
              <div className="header-item">
                <button
                  className="hbutton"
                  disabled={isSending || !targetAddr || !isAddressValid}
                  onClick={() =>
                    withdraw(
                      active.x,
                      active.y,
                      active.token,
                      active.addr as `0x${string}`,
                      targetAddr as `0x${string}`
                    )
                  }
                >
                  <span>
                    <FontAwesomeIcon icon={faArrowTurnDown} flip="horizontal" />
                    &nbsp;
                    {isSending ? 'Sending...' : 'Withdraw'}
                  </span>
                </button>
                <button
                  className="hbutton hbutton-lnk"
                  onClick={() => {
                    const key = buildPrivateKey(
                      active.x,
                      active.y,
                      spendingKey
                    );
                    copyTextToClipboard(key.toString(16, 32));
                    setIsCopied(true);
                    setTimeout(() => {
                      setIsCopied(false);
                    }, 1500);
                  }}
                >
                  <span>
                    <FontAwesomeIcon icon={isCopied ? faCheckCircle : faCopy} />{' '}
                    &nbsp;
                    {isCopied ? 'Copied!' : 'Copy private key'}
                  </span>
                </button>
              </div>
            </div>
          )}
          {(!!withdrawError || !!withdrawSuccess || !!txPending) && (
            <div className="lane">
              {txPending !== '' && (
                <p className="message">
                  <span>Transaction pending. </span>
                  <a
                    href={`https://explorer.testnet.rsk.co/tx/${txPending}`}
                    target="_blank"
                    rel="noreferrer"
                    className="link-text"
                  >
                    View on Rootstock Explorer{' '}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      transform={{ rotate: -45 }}
                    />
                  </a>
                </p>
              )}
              {!!withdrawError && (
                <p className="message error">Error: {withdrawError}</p>
              )}
              {!!withdrawSuccess && (
                <p className="message">
                  <strong>Transaction sent! </strong>
                  <a
                    href={`https://explorer.testnet.rsk.co/tx/${withdrawSuccess}`}
                    target="_blank"
                    rel="noreferrer"
                    className="link-text"
                  >
                    View on Rootstock Explorer{' '}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      transform={{ rotate: -45 }}
                    />
                  </a>
                </p>
              )}
            </div>
          )}
        </div>

        <div className="lane">
          <p className="discreet">
            Keys checked: {keysIndex} / {keysCount}
          </p>
        </div>
      </div>
    );
  }
}
