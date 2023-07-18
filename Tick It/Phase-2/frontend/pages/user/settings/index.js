import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useRouter } from "next/router";

import { useAuth } from "../../../auth/useAuth";
import { updateUser, getUsers } from "../../../axios/user.axios";

import DashboardBar from "../../../components/DashboardBar";
import TickitButton from "../../../components/tickitButton";
import ChangePasswordModal from "../../../components/ChangePasswordModal";
import Switch from "../../../components/Switch";

import styles from "./Settings.module.scss";

const Settings = () => {
  const { user, setUser } = useAuth();
  const [eventCheck, setEventCheck] = useState(true);
  const [emailCheck, setEmailCheck] = useState(true);
  const [newsCheck, setNewsCheck] = useState(true);
  const [userNameEdit, setUserNameEdit] = useState(false);
  const [emailEdit, setEmailEdit] = useState(false);
  const [mobileEdit, setMobileEdit] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  return (
    <>
      {passwordModal && (
        <ChangePasswordModal setPasswordModal={setPasswordModal} />
      )}
      <Container fluid className="dashboardWrapper">
        <Row>
          <Col lg={2} style={{ padding: "0px" }}>
            <DashboardBar selected="settings" />
          </Col>

          <Col lg={10}>
            <div className={styles.section}>
              <div className="cardWrapper">
                <div className={styles.sectionContent}>
                  <p className="section-title">Account Settings</p>
                  <Row className={styles.settingRow}>
                    <Col md={4} className={styles.settingCol}>
                      <p className={styles.settingCategory}>Email</p>
                    </Col>
                    <Col md={4} className={styles.settingCol}>
                      <p className={styles.settingValue}>{user?.email}</p>
                    </Col>
                    <Col md={4} className={styles.settingCol}></Col>
                  </Row>
                  <Row className={styles.settingRow}>
                    <Col md={4} className={styles.settingCol}>
                      <p className={styles.settingCategory}>Username</p>
                    </Col>
                    <Col md={4} className={styles.settingCol}>
                      {!userNameEdit && (
                        <p className={styles.settingValue}>{user?.username}</p>
                      )}
                      {userNameEdit && (
                        <input
                          type="text"
                          defaultValue={user?.username}
                          placeholder="Enter Username"
                          onChange={(e) => {
                            setUserName(e.target.value);
                          }}
                          required
                          className={styles.inputBar}
                        />
                      )}
                      <div
                        style={{
                          minHeight: "20px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {userNameError && (
                          <div className={styles.errors}>
                            <p className={styles.error}>
                              Username already in use
                            </p>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={4} className={styles.settingCol}>
                      {!userNameEdit && (
                        <TickitButton
                          isSmall
                          text="Edit"
                          onClick={() => {
                            setUserNameEdit(true);
                          }}
                        />
                      )}

                      {userNameEdit && (
                        <TickitButton
                          isSmall
                          text="Save"
                          style2={true}
                          disabled={!userName || userName == user?.username}
                          onClick={() => {
                            getUsers(
                              JSON.stringify({ where: { username: userName } })
                            ).then((user) => {
                              if (user.data.length > 0) {
                                setUserNameError(true);
                              } else {
                                setUserNameError(false);
                                updateUser({
                                  username: userName,
                                }).then((data) => {
                                  setUser(data);
                                  setUserNameEdit(false);
                                });
                              }
                            });
                          }}
                        />
                      )}
                    </Col>
                  </Row>

                  <Row className={styles.settingRow}>
                    <Col md={4} className={styles.settingCol}>
                      <p className={styles.settingCategory}>Phone Number</p>
                    </Col>
                    <Col md={4} className={styles.settingCol}>
                      {!mobileEdit && (
                        <p className={styles.settingValue}>
                          {user?.phoneNumber ?? "---"}
                        </p>
                      )}

                      {mobileEdit && (
                        <input
                          type="text"
                          defaultValue={user?.phoneNumber}
                          placeholder="Enter Phone Number"
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                          }}
                          required
                          className={styles.inputBar}
                        />
                      )}
                    </Col>
                    <Col md={4} className={styles.settingCol}>
                      {!mobileEdit && (
                        <TickitButton
                          isSmall
                          text="Edit"
                          onClick={() => {
                            setMobileEdit(true);
                          }}
                        />
                      )}
                      {mobileEdit && (
                        <TickitButton
                          text="Save"
                          isSmall
                          style2={true}
                          disabled={
                            !phoneNumber || phoneNumber == user?.phoneNumber
                          }
                          onClick={() => {
                            updateUser({
                              phoneNumber: phoneNumber,
                            }).then((data) => {
                              setUser(data);
                              setMobileEdit(false);
                            });
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div className={styles.section}>
              <div className="cardWrapper">
                <div className={styles.sectionContent}>
                  <p className="section-title">Notification Settings</p>

                  <div className={styles.switchDiv}>
                    <Switch
                      isOn={eventCheck}
                      name="event"
                      handleToggle={() => setEventCheck(!eventCheck)}
                    />

                    <p
                      onClick={() => setEventCheck(!eventCheck)}
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      className={styles.settingValue}
                    >
                      Send event reminders
                    </p>
                  </div>
                  <div className={styles.switchDiv}>
                    <Switch
                      isOn={emailCheck}
                      name="email"
                      handleToggle={() => setEmailCheck(!emailCheck)}
                    />

                    <p
                      onClick={() => setEmailCheck(!emailCheck)}
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      className={styles.settingValue}
                    >
                      Email notifications
                    </p>
                  </div>
                  <div className={styles.switchDiv}>
                    <Switch
                      isOn={newsCheck}
                      name="news"
                      handleToggle={() => setNewsCheck(!newsCheck)}
                    />

                    <p
                      onClick={() => setNewsCheck(!newsCheck)}
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      className={styles.settingValue}
                    >
                      Newsletter
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.section}>
              <div className="cardWrapper">
                <div className={styles.sectionContent}>
                  <p className="section-title">Security settings</p>
                  <div className={styles.settingLinkDiv}>
                    <div
                      onClick={() => {
                        setPasswordModal(true);
                      }}
                      className={styles.settingLink}
                    >
                      Change Password
                    </div>
                    <Link href="#" className={styles.settingLink}>
                      2FA
                    </Link>
                    <Link href="#" className={styles.settingLink}>
                      Login Activity
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Settings;
