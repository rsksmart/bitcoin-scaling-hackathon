import { ec as EC } from 'elliptic';
import { useCallback, useContext, useEffect, useState } from 'react';
import './rooted-pane.css';

import { faCopy, faSave } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle, faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { base58 } from 'ethers/lib/utils.js';
import { copyTextToClipboard } from '../utils/clipboard';
import { calculateCrc } from '../utils/crc16';
import { downloadTxtFile } from '../utils/download';
import { useLocalStorage } from '../utils/localstorage';
import { AddressContext, AddressContextType } from './address';
import { FileUploader } from './upload';

import chevronUp from '../svg/chevron-up.svg';

export function RootedID() {
  const ec = new EC('secp256k1');

  const { spendingKey, setSpendingKey } = useContext(
    AddressContext
  ) as AddressContextType;

  const [metaAddr, setMetaAddr] = useState<string>();
  const [copied, setCopied] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [loadSuccess, setLoadSuccess] = useState<boolean>(false);
  const [hash] = useState<string>(window.location.hash);
  const [keySaved, setKeySaved] = useState<boolean>(true);

  useEffect(() => {
    setOpened(hash.length < 20);
  }, [hash]);

  const [storedSpendingKey, setStoredSpendingKey] = useLocalStorage<
    string | null
  >('spendingKey', null);

  const generateNewKey = () => {
    const key = ec.genKeyPair();
    setSpendingKey(key);
    setStoredSpendingKey(key.getPrivate().toString(16));
    setKeySaved(false);
    setLoadError(false);
  };

  useEffect(() => {
    let skey;

    if (storedSpendingKey) {
      try {
        skey = ec.keyFromPrivate(storedSpendingKey, 'hex');
        setSpendingKey(skey);
      } catch (e) {
        console.log(e);
      }
    }

    if (!skey) {
      generateNewKey();
    }
  }, [storedSpendingKey]);

  useEffect(() => {
    if (!spendingKey) return;

    const data = Uint8Array.from(
      spendingKey.getPublic().encodeCompressed('array')
    );
    const crc = calculateCrc(data);

    const addr = new Uint8Array(data.length + 2);
    addr.set(data);
    addr.set(crc, data.length);

    setMetaAddr('R' + base58.encode(addr));
  }, [spendingKey]);

  const handleFile = async (f: File) => {
    if (!f) return;

    if (f.size !== 64) {
      setLoadError(true);
      return;
    }

    try {
      const key = await f.text();
      const skey = ec.keyFromPrivate(key, 'hex');
      setSpendingKey(skey);
      setStoredSpendingKey(key);

      setLoadSuccess(true);
      setKeySaved(true);

      setTimeout(() => {
        setLoadSuccess(false);
      }, 1500);
    } catch (e) {
      setLoadError(true);
      console.log(e);
    }
  };

  const handleCopy = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      copyTextToClipboard(metaAddr ? `https://rooted/#${metaAddr}` : '').then(
        () => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1500);
        }
      );
    },
    [metaAddr]
  );

  // const qrCode = metaAddr && (
  //   <QRCode size={224} value={metaAddr} viewBox={`0 0 256 256`} />
  // );

  return (
    <div className="large-block rooted-pane ">
      <div className="rooted-pane-header">
        {opened ? (
          <div className="rooted-pane-header">
            <div className="header-item" style={{ alignItems: 'center' }}>
              <div className="header-item header-title">
                <h1>Your Rooted ID</h1>
              </div>
              <button
                className={opened ? 'arrow' : 'arrow arrow-down'}
                onClick={() => setOpened(!opened)}
              >
                <img src={chevronUp} alt="" width={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="rooted-pane-header">
            <div className="header-item" style={{ alignItems: 'center' }}>
              <div className="block-wide">
                <p className="label" style={{ textTransform: 'uppercase' }}>
                  Your Rooted ID:
                </p>
                <p className="label rooted-id-contracted">{metaAddr}</p>
              </div>
              <button
                className={opened ? 'arrow mobile' : 'arrow arrow-down mobile'}
                onClick={() => setOpened(!opened)}
              >
                <img src={chevronUp} alt="" width={24} />
              </button>
            </div>

            <div className="header-item" style={{ alignItems: 'center' }}>
              <button
                title="Copy link"
                className="hbutton hbutton-lnk"
                onClick={handleCopy}
              >
                <span>
                  <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} />{' '}
                  COPY
                </span>
              </button>

              {spendingKey && (
                <button
                  className={keySaved ? 'hbutton hbutton-lnk' : 'hbutton'}
                  title="Save key"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadTxtFile(
                      spendingKey.getPrivate().toString(16),
                      `Rooted_${metaAddr}.txt`
                    )();
                    setKeySaved(true);
                  }}
                >
                  <span>
                    <FontAwesomeIcon icon={faSave} /> SAVE KEY
                  </span>
                </button>
              )}

              <button
                className={
                  opened ? 'arrow no-mobile' : 'arrow arrow-down no-mobile'
                }
                onClick={() => setOpened(!opened)}
              >
                <img src={chevronUp} alt="" width={24} />
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className="rooted-pane-body"
        style={{ display: opened ? 'block' : 'none' }}
      >
        <p className="block">Share the Rooted ID to receive funds.</p>
        <div className="rooted-pane-header buttons">
          <div className="block-wide">
            <p className="label" style={{ textTransform: 'uppercase' }}>
              Rooted ID:
            </p>
            <p className="label rooted-id">{metaAddr}</p>
          </div>
          <div className="header-item">
            <button
              className="hbutton hbutton-lnk"
              title="Copy link"
              onClick={handleCopy}
            >
              <span>
                <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} /> COPY
              </span>
            </button>
            <button
              className="hbutton hbutton-lnk"
              title="Generate new"
              onClick={generateNewKey}
            >
              <span>
                <FontAwesomeIcon icon={faRotate} /> Generate New
              </span>
            </button>
          </div>
        </div>

        <div className="line"></div>

        <div className="rooted-pane-header">
          <div className="block-wide">
            <p className="message">
              Once you shared your ID, you should <strong>save its key</strong>{' '}
              to be able to withdraw funds from it. <strong>Never</strong> share
              your key, only ID.
            </p>
          </div>

          <div className="header-item">
            <FileUploader
              preLoad={() => {
                setLoadError(false);
                setLoadSuccess(false);
              }}
              handleFile={handleFile}
            />

            {spendingKey && (
              <button
                className={keySaved ? 'hbutton hbutton-lnk' : 'hbutton'}
                onClick={() => {
                  downloadTxtFile(
                    spendingKey.getPrivate().toString(16),
                    `Rooted_${metaAddr}.txt`
                  )();
                  setKeySaved(true);
                }}
                disabled={!spendingKey}
              >
                <span>
                  <FontAwesomeIcon icon={faSave} /> Save key
                </span>
              </button>
            )}
          </div>
        </div>

        <div
          className="rooted-pane-header block message"
          style={{
            width: '90%',
            display: loadSuccess || loadError ? 'block' : 'none',
          }}
        >
          <div
            className="block-wide error-text"
            style={{
              display: loadError ? 'block' : 'none',
            }}
          >
            Incorrect Rooted ID keyfile
          </div>
          <div
            className="block-wide"
            style={{
              display: loadSuccess ? 'inline' : 'none',
            }}
          >
            Keyfile loaded!
          </div>
        </div>
      </div>
    </div>
  );
}
