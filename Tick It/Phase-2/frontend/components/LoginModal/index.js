import Link from "next/link";
import { Modal, Container, Form } from "react-bootstrap";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import { useFormik } from "formik";
import * as yup from "yup";

import { login, signup } from "../../axios/auth.axios";
import { useAuth } from "../../auth/useAuth";
import { getUsers } from "../../axios/user.axios";
import { useAuthModalContext } from "../../context/AuthModalProvider";
import Cookies from "js-cookie";
import { validate } from "../../axios/auth.axios";

import TickitButton from "../tickitButton";

import styles from "./LoginModal.module.scss";

const LoginModal = () => {
  // States
  const [loginUser, setLoginUser] = useState("");
  const [loginError, setLoginError] = useState(false);

  // Hooks
  const { logIn, user, setUser } = useAuth();
  const { modalOpen, setModalOpen } = useAuthModalContext();
  const router = useRouter();

  // Functions
  const restoreUser = async () => {
    const response = await validate("Bearer " + Cookies.get("token"));
    if (response) {
      setUser(response);
      Cookies.remove("token");
    }
  };

  const redirect = async () => {
    router.push(`${process.env.NEXT_PUBLIC_API_HOST}/auth/oAuth`);
  };

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("This email is invalid")
      .when("isSignup", {
        is: true,
        then: () =>
          yup
            .string()
            .email()
            .test(
              "checkDuplicateEmail",
              "Provided Email is not available",
              function (value) {
                return new Promise((resolve, reject) => {
                  getUsers(JSON.stringify({ where: { email: value } }))
                    .then((user) => {
                      if (user.data.length > 0) {
                        resolve(false);
                      } else {
                        resolve(true);
                      }
                    })
                    .catch(() => {
                      resolve(false);
                    });
                });
              }
            )
            .required("Email is a required field"),
      }),
    password: yup.string().min(6).required("Password is a required field"),
    username: yup.string().when("isSignup", {
      is: true,
      then: () =>
        yup
          .string()
          .test(
            "checkDuplicateUsername",
            "Provided Username is not available",
            function (value) {
              return new Promise((resolve, reject) => {
                getUsers(JSON.stringify({ where: { username: value } }))
                  .then((user) => {
                    if (user.data.length > 0) {
                      resolve(false);
                    } else {
                      resolve(true);
                    }
                  })
                  .catch(() => {
                    resolve(false);
                  });
              });
            }
          )
          .required("Username is a required field"),
    }),
    confirmpassword: yup.string().when("isSignup", {
      is: true,
      then: () =>
        yup
          .string()
          .min(6)
          .required("This field is required")
          .oneOf([yup.ref("password"), null], "Passwords must match"),
    }),
  });

  //Formik
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmpassword: "",
      isSignup: false,
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      setLoginError(false);

      try {
        let loginRes = await login({
          username: loginUser,
          password: values.password,
        });
        logIn(loginRes);
        if (loginRes) {
          setModalOpen(false);
          resetForm();
          setLoginUser("");
        }
      } catch (e) {
        setLoginError(true);
      }
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

  useEffect(() => {
    values.isSignup = false;
    if (Cookies.get("token")) {
      localStorage.setItem("token", "Bearer " + Cookies.get("token"));
      restoreUser();
    }
  }, []);

  return (
    <>
      {modalOpen && (
        <Modal show centered>
          <Modal.Header
            onClick={() => {
              setModalOpen(false);
              if (!user) {
                router.push("/");
              }
            }}
            className={styles.closeButton}
            closeButton
          />
          <Modal.Body>
            {values.isSignup ? (
              <Container>
                <div className={styles.inputDiv}>
                  <input
                    name="username"
                    type="Text"
                    placeholder="User Name"
                    value={values.username}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    style={{ maxWidth: "80%" }}
                    className="modalInput"
                  />
                </div>
                <div
                  style={{
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {errors.username && touched.username ? (
                    <div className={styles.errors}>
                      <p className={styles.error}> {errors.username}</p>
                    </div>
                  ) : null}
                </div>

                <div className={styles.inputDiv}>
                  <input
                    name="email"
                    type="email"
                    value={values.email}
                    placeholder="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    style={{ maxWidth: "80%" }}
                    className="modalInput"
                  />
                </div>
                <div
                  style={{
                    minHeight: "20px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {errors.email && touched.email ? (
                    <div className={styles.errors}>
                      <p className={styles.error}> {errors.email}</p>
                    </div>
                  ) : null}
                </div>
                <div className={styles.inputDiv}>
                  <input
                    name="password"
                    type="password"
                    value={values.password}
                    placeholder="Password"
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
                    justifyContent: "center",
                  }}
                >
                  {errors.password && touched.password ? (
                    <div className={styles.errors}>
                      <p className={styles.error}> {errors.password}</p>
                    </div>
                  ) : null}
                </div>
                <div className={styles.inputDiv}>
                  <input
                    name="confirmpassword"
                    type="password"
                    value={values.confirmpassword}
                    placeholder="Confirm Password"
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
                    justifyContent: "center",
                  }}
                >
                  {errors.confirmpassword && touched.confirmpassword ? (
                    <div className={styles.errors}>
                      <p className={styles.error}> {errors.confirmpassword}</p>
                    </div>
                  ) : null}
                </div>

                <div className={styles.inputDiv}>
                  <TickitButton
                    text="Sign Up"
                    onClick={async () => {
                      const response = await signup({
                        email: values.email,
                        username: values.username,
                        password: values.password,
                      });
                      logIn(response);
                      if (response) {
                        values.confirmpassword = null;
                        values.password = null;
                        values.email = null;
                        values.username = null;
                        values.isSignup = false;
                        setModalOpen(false);
                      }
                    }}
                    disabled={
                      values.email == null ||
                      values.password == null ||
                      values.username == null ||
                      values.confirmpassword == null ||
                      values.password != values.confirmpassword
                    }
                  />
                </div>
                <div className={styles.googleLoginDiv}>
                  <div onClick={redirect} className={styles.googleLogin}>
                    <Image
                      width={26}
                      height={26}
                      className={styles.mainLogo}
                      alt="google-icon"
                      src="/images/googleicon.svg"
                    />
                    <p className={styles.googleinput}>Log In with Google</p>
                  </div>
                  <div className={styles.signupdiv}>
                    <p className={styles.signup}>If you have an account,</p>
                    <div
                      onClick={() => {
                        setFieldValue("isSignup", false);
                      }}
                      className={styles.signuplink}
                    >
                      Log in.
                    </div>
                  </div>
                </div>
              </Container>
            ) : (
              <Container>
                <Form>
                  <div className={styles.inputDiv}>
                    <input
                      name="email"
                      type="text"
                      value={loginUser}
                      placeholder="Email or Username"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        setLoginUser(e.target.value);
                      }}
                      style={{ maxWidth: "80%" }}
                      className="modalInput"
                    />
                  </div>
                  <div
                    style={{
                      minHeight: "20px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {errors.email && touched.email ? (
                      <div className={styles.errors}>
                        <p className={styles.error}> {errors.email}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className={styles.inputDiv}>
                    <input
                      name="password"
                      type="password"
                      value={values.password}
                      placeholder="Password"
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
                      justifyContent: "center",
                    }}
                  >
                    {errors.password && touched.password ? (
                      <div className={styles.errors}>
                        <p className={styles.error}> {errors.password}</p>
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.forgetpass}>
                    <Link className={styles.forgetpassword} href="#">
                      Forgot password?
                    </Link>
                  </div>
                  <div className={styles.inputDiv}>
                    <TickitButton text="Log In" onClick={handleSubmit} />
                  </div>
                  <div
                    style={{
                      minHeight: "20px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {loginError ? (
                      <div style={{ width: "100%", textAlign: "center" }}>
                        <p className={styles.error}>
                          Wrong username or password
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div className={styles.googleLoginDiv}>
                    <div onClick={redirect} className={styles.googleLogin}>
                      <Image
                        width={26}
                        height={26}
                        className={styles.mainLogo}
                        alt="google-icon"
                        src="/images/googleicon.svg"
                      />
                      <p className={styles.googleinput}>Log In with Google</p>
                    </div>

                    <div className={styles.signupdiv}>
                      <p className={styles.signup}>
                        If you don’t have an account yet,
                      </p>
                      <div
                        onClick={() => {
                          setFieldValue("isSignup", true);
                        }}
                        className={styles.signuplink}
                      >
                        Sign up.
                      </div>
                    </div>
                  </div>
                </Form>
              </Container>
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default LoginModal;
