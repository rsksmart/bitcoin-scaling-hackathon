import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./AddOrganizationCard.module.scss";

const AddOrganizationCard = () => {
  const router = useRouter();
  return (
    <div className={styles.organizerCard}>
      <div
        className={styles.addOrganizer}
        onClick={() => {
          router.push({
            pathname: "/vetting",
            query: { newOrg: true },
          });
        }}
      >
        <Image
          width={512}
          height={512}
          className={styles.cardImage}
          alt="image"
          src="/images/addOrganization.png"
        />
      </div>
      <p className={styles.organizationName}>Create Organization</p>
    </div>
  );
};

export default AddOrganizationCard;
