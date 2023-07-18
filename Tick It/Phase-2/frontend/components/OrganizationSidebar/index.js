import React, { useState, useEffect } from "react";
import { Sidebar, Menu, useProSidebar } from "react-pro-sidebar";
import Link from "next/link";
import Image from "next/image";

import styles from "./OrganizationSidebar.module.scss";

const OrganizationSidebar = () => {
  const [width, setWidth] = useState();

  const { toggleSidebar } = useProSidebar();

  const getWidth = () => {
    let a = window.innerWidth;
    if (a > 991) {
      setWidth(a);
    }
  };

  useEffect(() => {
    getWidth();
  }, []);

  return (
    <div className={styles.sideBar}>
      <Sidebar
        breakPoint="lg"
        backgroundColor={width > 991 ? "transparent" : "var(--background)"}
        width={width > 991 ? "100%" : "80%"}
        className={styles.sideBarmenu}
      >
        <Menu>
          <div className={styles.userDetails}>
            <div className={styles.dropTitle}>
              <Image
                width={38}
                height={38}
                alt="search"
                src="/images/profile.png"
                className={styles.profileImage}
              />
              <p className={styles.userName}>Factory People</p>
              <Image
                width={23}
                height={13}
                alt="search"
                src="/images/downArrow.png"
                className={styles.arrowDown}
              />
            </div>
          </div>
          <div className={styles.dashboardBar}>
            <Link href="#" className={styles.dashboardLink}>
              All Events
            </Link>
            <Link href="#" className={styles.dashboardLink}>
              Team
            </Link>
            <Link href="#" className={styles.dashboardLink}>
              Payment Settings
            </Link>
          </div>
        </Menu>
      </Sidebar>
      <main style={{ display: "flex", padding: 10 }}>
        <div
          onClick={() => {
            toggleSidebar();
          }}
          className={`d-lg-none mx-auto mb-2`}
        >
          <Image
            alt="openmodal"
            src="/images/rightarrow.png"
            width="40"
            height="30"
          />
        </div>
      </main>
    </div>
  );
};
export default OrganizationSidebar;
