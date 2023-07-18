import React from "react";
import { Modal, Container } from "react-bootstrap";
import Image from "next/image";

import styles from "./RecipientsModal.module.scss";

const RecipientsModal = ({ setRecipientsModal }) => {
  return (
    <Modal show onHide={() => {}} centered>
      <Modal.Header
        onClick={() => {
          setRecipientsModal(false);
        }}
        className={styles.closeButton}
        closeButton
      />
      <Modal.Body>
        <Container>
          <div className={styles.checkOutCard}>
            <p className={styles.title}>Recipients</p>
            <p className={styles.subtitle}>Sunset Curve</p>
            <p className={styles.type}>Front Seat</p>

            <div className={styles.checkOutDetailsDiv}>
              <div className={styles.checkOutDetails}>
                <p className={styles.details}>JohnDoe@gmail.com</p>
                <Image
                  width={14}
                  height={18}
                  alt="delete"
                  src="/images/delete.png"
                />
              </div>
              <div className={styles.checkOutDetails}>
                <p className={styles.details}>0x6802...1B4f</p>
                <Image
                  width={14}
                  height={18}
                  alt="delete"
                  src="/images/delete.png"
                />
              </div>
              <div className={styles.checkOutDetails}>
                <p className={styles.details}>JaneDoe@gmail.com</p>
              </div>
            </div>
            <div className={styles.addRecipientsDiv}>
              <input
                type="text"
                // value={}
                placeholder="Enter recipient email or wallet address"
                onChange={(e) => {}}
                className="modalInput"
              />
              <Image
                width={20}
                height={20}
                alt="add"
                src="/images/addYellow.svg"
                style={{ marginLeft: "12px", cursor: "pointer" }}
              />
            </div>
          </div>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default RecipientsModal;
