import { useCallback, useEffect, useMemo, useState } from 'react';
import './panes.css';

import { curve, ec as EC } from 'elliptic';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber, ethers } from 'ethers';
import { base58, getAddress, keccak256, parseEther } from 'ethers/lib/utils.js';
import {
  useAccount,
  useBalance,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction
} from 'wagmi';
import { default as REGISTRY_ABI } from '../abi/Registry.json';
import { registryAddress } from '../utils/constants';
import { calculateCrc } from '../utils/crc16';
import useDebounce from '../utils/debounce';
import { formatEtherTruncated } from '../utils/format';

const zero = BigNumber.from(0);

export function Send() {
  const ec = useMemo(() => {
    return new EC('secp256k1');
  }, []);

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
    watch: true,
    cacheTime: 3_500,
  });
  const { chain } = useNetwork();

  const [rootstockAddr, setrootstockAddr] = useState<string>(
    ethers.constants.AddressZero
  );
  const [sharedSecretByte, setSharedSecretByte] = useState<string>('0x00');
  const [theirID, setTheirID] = useState<string>('');
  const [ephPublic, setEphPublic] = useState<curve.base.BasePoint>();
  const [rootedIDError, setRootedIDError] = useState<boolean>(false);
  const [amountError, setAmountError] = useState<boolean>(false);

  const [amount, setAmount] = useState<string>('0');
  const [amountWei, setAmountWei] = useState<BigNumber>(zero);
  const [hash] = useState<string>(window.location.hash);

  const debouncedAmount = useDebounce(amountWei, 500);
  const debouncedAddr = useDebounce(rootstockAddr, 500);

  const {
    isError: isPrepareError,
    error: prepareError,
    config,
  } = usePrepareContractWrite({
    address: registryAddress[chain?.id || 0],
    abi: REGISTRY_ABI,
    functionName: 'publishAndSend',
    args: [
      '0x' + ephPublic?.getX().toString(16, 64),
      '0x' + ephPublic?.getY().toString(16, 64),
      '0x' + sharedSecretByte,
      debouncedAddr,
    ],
    overrides: { value: debouncedAmount },
    enabled: debouncedAmount.gt(zero),
  });
  const { data, isError, error, write, reset } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleIDInput = (ev: React.FormEvent<HTMLInputElement>) => {
    setTheirID(ev.currentTarget.value);
    setRootedIDError(false);
    reset();
  };

  const handleAmountInput = (ev: React.FormEvent<HTMLInputElement>) => {
    setAmount(ev.currentTarget.value);
    setAmountError(false);
  };

  const generateNewEphKey = useCallback(() => {
    if (!theirID) return;

    if (theirID.at(0) !== 'R') {
      setRootedIDError(true);
      return;
    }

    const _theirID = theirID.slice(1);
    let decodedID: Uint8Array;
    try {
      decodedID = base58.decode(_theirID);
    } catch (e) {
      console.log('Invalid base58 encoding');
      setRootedIDError(true);
      return;
    }

    if (decodedID.length !== 35) {
      setRootedIDError(true);
      return;
    }

    const trueID = decodedID.subarray(0, 33);
    const crc = calculateCrc(trueID);
    if (!crc.every((x, idx) => x === decodedID[33 + idx])) {
      console.log('CRC error: ' + crc + '; ' + decodedID);
      setRootedIDError(true);
      return;
    }

    try {
      const meta = ec.keyFromPublic(trueID, 'hex');

      // generate eph key
      const ephKey = ec.genKeyPair();
      setEphPublic(ephKey.getPublic());

      const ss = ephKey.derive(meta.getPublic());

      const hashed = ec.keyFromPrivate(keccak256(ss.toArray()));
      const pub = meta
        .getPublic()
        .add(hashed.getPublic())
        .encode('array', false);

      const addr = keccak256(pub.splice(1));

      setrootstockAddr(
        getAddress('0x' + addr.substring(addr.length - 40, addr.length))
      );

      setSharedSecretByte(ss.toArray()[0].toString(16).padStart(2, '0'));
      console.log(rootstockAddr);
      console.log(
        `Current ephemeral pubkey: ${ephKey.getPublic().encode('hex', false)}`
      );
    } catch (e) {
      setRootedIDError(true);
    }
  }, [theirID, ec]);

  useEffect(() => {
    if (!theirID) return;

    if (theirID.startsWith('https://rooted/#')) {
      setTheirID(theirID.replace('https://rooted/#', ''));
    } else {
      generateNewEphKey();
    }
  }, [theirID, generateNewEphKey]);

  useEffect(() => {
    generateNewEphKey();
  }, [isSuccess]);

  useEffect(() => {
    if (hash.length > 20) {
      setTheirID(hash.slice(1));
    }
  }, [hash]);

  useEffect(() => {
    try {
      const _amount = parseEther(amount);
      setAmountWei(_amount);

      if (balance) {
        if (_amount.gte(balance.value)) {
          setAmountError(true);
        }
      }
    } catch (e) {
      setAmountError(true);
    }
  }, [amount, balance]);

  return (
    <div style={{ paddingTop: '1rem' }}>
      <p>
        Funds will be sent to the temporary stealth blockchain account,
        controlled by the owner of Rooted ID.
      </p>
      <form
        className="lane"
        onSubmit={() => {
          return false;
        }}
      >
        <div className="input-container">
          <input
            type="text"
            id="rootedID"
            value={theirID}
            disabled={!isConnected || isLoading}
            spellCheck="false"
            autoComplete="off"
            placeholder="Enter receiver Rooted ID"
            onChange={handleIDInput}
          />
          <label htmlFor="rootedID">ROOTED ID</label>
        </div>
      </form>

      {!isConnected && (
        <p style={{ marginTop: '1.75rem' }}>
          <b
            onClick={() => {
              window.scrollTo({ top: 0 });
            }}
          >
            Connect wallet
          </b>{' '}
          to proceed.
        </p>
      )}
      {isConnected && balance && (
        <>
          <div>
            <form
              className="lane"
              onSubmit={() => {
                return false;
              }}
            >
              <div className="header-item">
                <div className="input-container small">
                  <input
                    type="text"
                    value={amount}
                    autoComplete="off"
                    id="amount"
                    disabled={isLoading}
                    style={{ textAlign: 'left' }}
                    className={amountError ? 'error-input' : ''}
                    placeholder="0.00"
                    onChange={handleAmountInput}
                  />

                  <label htmlFor="amount">
                    Amount ({chain?.nativeCurrency.symbol})
                  </label>
                </div>

                <div className="input-container hint">
                  <input
                    value={`${formatEtherTruncated(balance.value)} ${
                      chain?.nativeCurrency.symbol
                    }`}
                    disabled
                  />
                  <label>Available</label>
                </div>
              </div>

              <button
                className="hbutton"
                color="success"
                disabled={!write || isLoading || amountError || rootedIDError}
                onClick={(e) => {
                  e.preventDefault();
                  write?.();
                }}
              >
                <span>
                  <FontAwesomeIcon icon={faArrowRight} />
                  &nbsp;
                  {isLoading
                    ? 'Sending...'
                    : `Send ${chain?.nativeCurrency.symbol}`}
                </span>
              </button>
            </form>
          </div>
          {rootedIDError && (
            <div className="lane">
              <p className="message error">Invalid Rooted ID</p>
            </div>
          )}
          {isSuccess && !isError && !isPrepareError && (
            <div className="lane">
              <p className="message">
                <strong>Successfully sent!</strong>&nbsp;
                <a
                  href={`https://explorer.testnet.rsk.co/tx/${data?.hash}`}
                  className="link-text"
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Rootstock Testnet{' '}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    transform={{ rotate: -45 }}
                  />
                </a>
              </p>
            </div>
          )}
          {(isPrepareError || isError) && (
            <div className="lane">
              <p className="message error">
                Error: {(prepareError || error)?.message}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
