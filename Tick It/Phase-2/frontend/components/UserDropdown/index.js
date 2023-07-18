import React from "react";
import Link from "next/link";

import { useEvm } from "@cryptogate/react-providers";

import styles from "./UserDropdown.module.scss";

const UserDropdown = ({ isOpen, onClose, logOut, user }) => {
  const { deactivate } = useEvm();
  return (
    <div className={`${styles.menu} ${isOpen && styles.show} `}>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={`${styles.dropdown} ${isOpen && styles.active} `}>
        <p className={styles.dropdownTitle}>{user?.username}</p>
        <p className={styles.dropdownEmail}>{user?.email}</p>
        <Link
          onClick={onClose}
          href="/user/dashboard"
          className={styles.dropdownLink}
        >
          Dashboard
        </Link>

        <Link
          onClick={onClose}
          href="/user/tickets"
          className={styles.dropdownLink}
        >
          Tickets
        </Link>
        <Link
          onClick={onClose}
          href="/user/funds"
          className={styles.dropdownLink}
        >
          Funds
        </Link>
        <Link
          onClick={onClose}
          href="/user/hosting"
          className={styles.dropdownLink}
        >
          Hosting
        </Link>
        <Link
          onClick={onClose}
          href="/user/attendance"
          className={styles.dropdownLink}
        >
          Attendance
        </Link>
        <Link
          onClick={onClose}
          href="/user/activity"
          className={styles.dropdownLink}
        >
          Activity
        </Link>
        <hr className={styles.horline} />
        <Link
          onClick={onClose}
          href="/user/settings"
          className={styles.dropdownLink}
        >
          Settings
        </Link>
        <div
          className={styles.dropdownBtn}
          onClick={() => {
            // signOut("google");
            logOut();
            onClose();
            deactivate();
          }}
        >
          Log Out
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
