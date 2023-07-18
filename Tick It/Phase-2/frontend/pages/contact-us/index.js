import { Col, Row, Container } from "react-bootstrap";

import TickitButton from "../../components/tickitButton";
import ProfileSocials from "../../components/ProfileSocials";

import styles from "./contactUs.module.scss";

const ContactUs = () => {
  return (
    <div className={styles.Wrapper}>
      <Container>
        <div className={styles.container}>
          <p className="pageTitle"> Contact Us</p>
        </div>
        <Row>
          <Col lg={6}>
            <div>
              <p className="section-title">Send us a message</p>
              <p className={styles.email}>Email</p>

              <div className={styles.inputDiv}>
                <input type="email" className="modalInput" />
              </div>
              <div className={styles.message}>
                <p className={styles.email}>Message</p>

                <div className={styles.messageInput}>
                  <textarea
                    className="modalInput"
                    style={{ minHeight: "150px" }}
                  />
                </div>
              </div>
              <div style={{ marginTop: "40px" }}>
                <TickitButton text="SEND MESSAGE" />
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <Row>
              <Col lg={12} md={6} sm={6} xs={6} className={styles.card}>
                <p className={styles.cardTitle}>Headquaters</p>
                <p className={styles.cardInfo}>Lebanon,Beirut</p>
                <p className={styles.cardInfo}>Address line</p>
                <p className={styles.cardInfo}>Headquaters</p>
              </Col>

              <Col lg={12} md={6} sm={6} xs={6} className={styles.card}>
                <p className={styles.cardTitle}>Headquaters</p>
                <p className={styles.cardInfo}>Lebanon,Beirut</p>
                <p className={styles.cardInfo}>Address line</p>
                <p className={styles.cardInfo}>Headquaters</p>
              </Col>

              <Col lg={12} className={styles.socials}>
                <ProfileSocials
                  centered
                  telegram="c"
                  instagram="c"
                  twitter="c"
                  discord="c"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default ContactUs;
