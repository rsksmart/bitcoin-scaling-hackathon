import React, { useState, useEffect } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import { changePassword } from "../../axios/user.axios";
import { login } from "../../axios/auth.axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../../auth/useAuth";
import TickitButton from "../tickitButton";
import styles from "./ChangePasswordModal.module.scss";

const ChangePasswordModal = ({ setPasswordModal }) => {
  const [loginError, setLoginError] = useState(false);
  // Hooks
  const schema = yup.object().shape({
    newPassword: yup.string().min(6).required("New password is required"),
    oldPassword: yup.string().required("Old password is required"),
    confirmPassword: yup
      .string()
      .min(6)
      .required("This field is required")
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      oldPassword: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setLoginError(false);
      changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
        .then((data) => {
          setPasswordModal(false);
        })
        .catch(() => {
          setLoginError(true);
        });
    },
  });

  const {
    handleSubmit,
    handleChange,
    values,
    errors,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
    isValid,
    touched,
    setErrors,
    status,
    setValues,
  } = formik;
  return (
    <Modal show onHide={() => {}} centered>
      <Modal.Header
        onClick={() => {
          setPasswordModal(false);
        }}
        className={styles.closeButton}
        closeButton
      />
      <div className={styles.payTitle}></div>
      <Modal.Body>
        <Container fluid>
          <div>
            <div className={styles.checkOutDetailsDiv}>
              <p className="section-title">Change Password</p>
              <div className={styles.InputDiv} style={{ marginTop: "12px" }}>
                <p className={styles.paymentTitle}>Old Password</p>
                <input
                  name="oldPassword"
                  type="password"
                  value={values.oldPassword}
                  placeholder="Old Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ maxWidth: "80%" }}
                  className="modalInput"
                />
              </div>

              <div
                style={{
                  minHeight: "20px",
                  display: "flex",
                }}
              >
                {errors.oldPassword && touched.oldPassword ? (
                  <div>
                    <p className={styles.error}> {errors.oldPassword}</p>
                  </div>
                ) : null}
                {loginError && !errors.oldPassword ? (
                  <div>
                    <p className={styles.error}>Wrong password</p>
                  </div>
                ) : null}
              </div>

              <div className={styles.InputDiv}>
                <p className={styles.paymentTitle}>New Password</p>
                <input
                  name="newPassword"
                  type="password"
                  value={values.newPassword}
                  placeholder="New Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ maxWidth: "80%" }}
                  className="modalInput"
                />
              </div>
              <div style={{ height: "18px" }}>
                {errors.newPassword && touched.newPassword ? (
                  <div className={styles.errors}>
                    <p className={styles.error}> {errors.newPassword}</p>
                  </div>
                ) : null}
              </div>
            </div>
            <Row className={styles.holderInput}>
              <Col>
                <div className={styles.InputDiv}>
                  <p className={styles.paymentTitle}>Confirm Password </p>
                  <input
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ maxWidth: "80%" }}
                    className="modalInput"
                  />
                </div>
                <div style={{ height: "18px" }}>
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <div className={styles.errors}>
                      <p className={styles.error}> {errors.confirmPassword}</p>
                    </div>
                  ) : null}
                </div>
              </Col>
              <div className={styles.changePassword}>
                <TickitButton onClick={handleSubmit} text="Change Password" />
              </div>
            </Row>
          </div>
        </Container>
      </Modal.Body>
    </Modal>
  );
};
export default ChangePasswordModal;
