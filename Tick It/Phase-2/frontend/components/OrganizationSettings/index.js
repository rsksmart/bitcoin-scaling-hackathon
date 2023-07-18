import React from "react";
import { Container } from "react-bootstrap";

import TickitButton from "../../components/tickitButton";

import styles from "./OrganizationSettings.module.scss";

const OrganizationSettings = () => {
  return (
    <Container fluid className={styles.organization}>
      <p className="pageTitle">Payment Settings</p>
      <div>
        <p className={styles.paymentFunds}>Funds Available: $ 52,968.78</p>
        <div style={{ width: "40%", marginTop: "70px" }}>
          <TickitButton
            text="WITHDRAW IN CRYPTO"
            minWidth="100%"
            fontSize="20px"
            padding="15px 10px"
          />
          <div style={{ marginTop: "35px" }}>
            <TickitButton
              text="WITHDRAW IN FIAT"
              minWidth="100%"
              fontSize="20px"
              padding="15px 10px"
              style2
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OrganizationSettings;
