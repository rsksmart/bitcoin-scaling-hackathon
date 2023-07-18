import React from "react";
import { Modal, Container } from "react-bootstrap";

import TickitButton from "../tickitButton";

import styles from "./WithDrawModal.module.scss";

const WithDrawModal = ({ setWithDrawModal }) => {
  return (
    <Modal show onHide={() => {}} centered>
      <Modal.Header
        onClick={() => {
          setWithDrawModal(false);
        }}
        className={styles.closeButton}
        closeButton
      />
      <Modal.Body>
        <div className={styles.payTitle}>
          <p className="section-title">Withdraw Funds</p>
        </div>
        <Container>
          <div>
            <div className={styles.withDrawDiv}>
              <input
                type="text"
                // value={}
                placeholder="Recipient's ETH address"
                onChange={(e) => {}}
                className="modalInput"
              />
            </div>
            <div className={styles.withDrawDiv}>
              <input
                type="text"
                // value={}
                placeholder="Amount"
                onChange={(e) => {}}
                className="modalInput"
              />
              <div className={styles.amount}>
                <p style={{ marginBottom: "0", color: " #848484" }}>USD</p>
                <p
                  onClick={() => {}}
                  style={{
                    marginBottom: "0",
                    marginLeft: "5px",
                    cursor: "pointer",
                  }}
                >
                  Max
                </p>
              </div>
            </div>
            <div className={styles.address}>
              <p className={styles.addressSentence}>Available: $157</p>
            </div>

            <div className={styles.nextButton}>
              <TickitButton style={1} text="NEXT" />
            </div>
          </div>
        </Container>
      </Modal.Body>
    </Modal>
  );
};
export default WithDrawModal;
