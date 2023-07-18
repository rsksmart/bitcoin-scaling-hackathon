import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";

import { getUsers } from "../../axios/user.axios";

import EventDetails from "../EventDetails";
import ProfileSocials from "../ProfileSocials";
import ReportModal from "../ReportModal";
import EditOrganizationModal from "../EditOrganizationModal";

import styles from "./UserProfileDetails.module.scss";

const UserProfileDetails = ({ data }) => {
  const [reportModal, setReportModal] = useState(false);
  const [editOrganizationModal, setEditOrganizationModal] = useState(false);
  const [userData, setUserData] = useState();
  const [vettingData, setVettingData] = useState();
  const getUserData = async () => {
    getUsers(JSON.stringify({ where: { id: data.ownerId } })).then((data) => {
      setUserData(data.data[0]);
    });
  };
  const parseVettingDetails = async () => {
    setVettingData(JSON.parse(data.vettingObj));
  };
  useEffect(() => {
    if (data) {
      getUserData();
      parseVettingDetails();
    }
  }, [data]);

  return (
    <>
      {reportModal && <ReportModal setReportModal={setReportModal} />}
      {editOrganizationModal && (
        <EditOrganizationModal
          setEditOrganizationModal={setEditOrganizationModal}
        />
      )}
      <div className={styles.wrapper}>
        <Container>
          <Row className={styles.profile}>
            <Col lg={4} className={styles.imageCol}>
              <Image
                width={208}
                height={208}
                alt="user"
                src={data?.profile}
                // src="/images/userPhoto2.png"
                className={styles.profileImage}
              />
            </Col>
            <Col lg={8}>
              {/* {state == 2 && ( */}
              <div className={styles.edit}>
                <Image
                  onClick={() => {
                    setEditOrganizationModal(true);
                  }}
                  width={27}
                  height={27}
                  alt="user"
                  src="/images/edit2.png"
                  className={styles.editImage}
                />
              </div>
              {/* )} */}
              <div className={styles.profileHeader}>
                {/* {state == 2 && ( */}
                <div>
                  <div className={styles.view}>
                    <Image
                      width={22}
                      height={15}
                      alt="user"
                      src="/images/view.png"
                    />
                    <p className={styles.viewTitle}>View Public Profile</p>
                  </div>

                  <p className={styles.title}>Welcome, {userData?.username}</p>
                </div>
                {/* )} */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p className={styles.titlePage}>{data?.name}</p>
                  {/* {state == 1 && ( */}
                  <div
                    onClick={() => {
                      setReportModal(true);
                    }}
                    className={styles.reportDiv}
                  >
                    <Image
                      width={12}
                      height={12}
                      alt="report"
                      src="/images/reportIcon.png"
                    />
                    <p className={styles.profileReport}>Report</p>
                  </div>
                  {/* )} */}
                </div>
              </div>
              <div style={{ marginTop: "15px" }}>
                <EventDetails details={vettingData?.description} />
              </div>

              {/* {state == 1 && ( */}
              <div style={{ paddingTop: "22px" }}>
                <ProfileSocials
                // telegram="c"
                // instagram="c"
                // twitter="c"
                // discord="c"
                />
              </div>
              {/* )} */}
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserProfileDetails;
