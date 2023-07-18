import React from "react";
import { Row, Col } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faDiscord,
  faTelegramPlane,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

import styles from "./ProfileSocials.module.scss";

const ProfileSocials = ({
  discord,
  twitter,
  instagram,
  telegram,
  centered = false,
}) => {
  return (
    <Row
      className={styles.socials}
      style={{
        justifyContent: centered == true ? "center" : "flex-start",
      }}
    >
      {discord && (
        <Col xs={1} style={{ margin: "0px 10px" }}>
          <FontAwesomeIcon
            className={styles.socialIcon}
            icon={faDiscord}
            onClick={() => {
              window.open(`https://discord.gg/${discord}`, "_blank");
            }}
          />
        </Col>
      )}
      {twitter && (
        <Col xs={1} style={{ margin: "0px 10px" }}>
          <FontAwesomeIcon
            icon={faTwitter}
            className={styles.socialIcon}
            onClick={() => {
              window.open(`https://twitter.com/${twitter}`, "_blank");
            }}
          />
        </Col>
      )}
      {telegram && (
        <Col xs={1} style={{ margin: "0px 10px" }}>
          <FontAwesomeIcon
            icon={faTelegramPlane}
            className={styles.socialIcon}
            onClick={() => {
              window.open(`https://t.me/${telegram}`, "_blank");
            }}
          />
        </Col>
      )}
      {instagram && (
        <Col xs={1} style={{ margin: "0px 10px" }}>
          <FontAwesomeIcon
            icon={faInstagram}
            className={styles.socialIcon}
            onClick={() => {
              window.open(`https://www.instagram.com/${instagram}`, "_blank");
            }}
          />
        </Col>
      )}
    </Row>
  );
};

export default ProfileSocials;
