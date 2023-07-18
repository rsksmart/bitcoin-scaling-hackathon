import React from "react";
import { Col } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

import styles from "./OrganizationCard.module.scss";

const OrganizationCard = ({ data }) => {
  return (
    <Col lg={3} md={6} className={styles.organizerCard}>
      <Link
        href={{
          pathname: `/organization/${data.id}`,
        }}
        style={{ textDecoration: "none" }}
      >
        <div>
          <Image
            width={512}
            height={512}
            className={styles.cardImage}
            alt="image"
            src={data?.profile}
          />
        </div>
        <p className={styles.organizationName}>{data?.name}</p>
        <p className={styles.organizationRole}>Organizer</p>
      </Link>
    </Col>
  );
};

export default OrganizationCard;
