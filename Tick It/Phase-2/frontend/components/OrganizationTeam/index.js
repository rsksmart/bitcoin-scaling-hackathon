import Image from "next/image";
import React from "react";
import { Container, Row } from "react-bootstrap";
import { Table } from "react-bootstrap";

import TickitButton from "../../components/tickitButton";

import styles from "./OrganizationTeam.module.scss";

const OrganizationTeam = () => {
  return (
    <Container fluid className={styles.organization}>
      <Row style={{ padding: "0px" }}>
        <div className={styles.teamCard}>
          <div style={{ display: "flex" }}>
            <p className={styles.teamTitle}>Team</p>
            <div style={{ display: "flex" }}>
              <Image
                width={22}
                height={22}
                alt="search"
                src="/images/addButton.svg"
                className={styles.addButton}
              />
              <p className={styles.addTitle}>Add Staff</p>
            </div>
          </div>
          <div>
            <Table
              striped
              style={{
                backgroundColor: "#0c0c0c",
                color: "white",
              }}
            >
              <thead>
                <tr>
                  <th className={styles.tableHead}> Name</th>
                  <th className={styles.tableHead}>Email</th>
                  <th className={styles.tableHead}>Position</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className={styles.bodyText}>Edward</td>
                  <td className={styles.bodyText}>edward.king@gmail.com</td>
                  <td className={styles.bodyText}>Super Admin</td>
                </tr>
                <tr>
                  <td className={styles.bodyText}>Edward</td>
                  <td className={styles.bodyText}>edward.king@gmail.com</td>
                  <td className={styles.bodyText}>Admin</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </Row>
      <Row style={{ padding: "0px" }}>
        <div className={styles.hostCard}>
          <div style={{ display: "flex" }}>
            <p className={styles.teamTitle}>Hosts</p>
            <div style={{ display: "flex" }}>
              <Image
                width={22}
                height={22}
                alt="search"
                src="/images/addButton.svg"
                className={styles.addButton}
              />
              <p className={styles.addTitle}>Add Host</p>
            </div>
          </div>
          <div>
            <Table
              striped
              style={{
                backgroundColor: "#0c0c0c",
                color: "white",
              }}
            >
              <thead>
                <tr>
                  <th className={styles.tableHead}> Name</th>
                  <th className={styles.tableHead}>Email</th>
                  <th className={styles.tableHead}>Event</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className={styles.bodyText}>Edward</td>
                  <td className={styles.bodyText}>edward.king@gmail.com</td>
                  <td className={styles.bodyText2}>ACDC Live</td>
                </tr>
                <tr>
                  <td className={styles.bodyText}>Edward</td>
                  <td className={styles.bodyText}>edward.king@gmail.com</td>
                  <td className={styles.bodyText2}>ACDC Live</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </Row>
      <Row
        style={{
          padding: "30px 0px 0px 25px",
        }}
      >
        <TickitButton
          text="TRANSFER OWNERSHIP"
          padding="15px 20px"
          fontSize="20px"
        />
      </Row>
    </Container>
  );
};
export default OrganizationTeam;
