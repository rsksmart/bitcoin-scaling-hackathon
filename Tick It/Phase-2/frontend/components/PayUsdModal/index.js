import { useRouter } from "next/router";
import React, { useState } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";

import { useFormik } from "formik";
import * as yup from "yup";

import { postCustodialMint } from "../../axios/ticket.axios";
import { useCartContext } from "../../cart/cart-context";

import TickitButton from "../tickitButton";

import styles from "./PayUsd.module.scss";

const PayUsd = ({ setUsdModal, cartItemData, total, parsedData }) => {
  // States
  const [mintModal, setMintModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hooks
  const router = useRouter();
  const { emptyCart } = useCartContext();

  // Functions
  const custodialWallet = () => {
    Object.keys(parsedData).map((key) => {
      const transaction = parsedData[key];

      postCustodialMint({
        contractAddress: key,
        ticketTypeCounts: transaction.tickets,
        proof: "",
      });
    });

    setMintModal(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  // Formik
  const schema = yup.object().shape({
    holder: yup.string().required("This field is required"),
    ccv: yup.number().required("This field is required"),
    number: yup.number().required("This field is required"),
    date: yup.date().required("Date is required"),
  });

  const formik = useFormik({
    initialValues: {
      holder: "",
      ccv: "",
      number: "",
      date: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {},
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
          setUsdModal(false);
        }}
        className={styles.closeButton}
        closeButton
      />
      <div className={styles.payTitle}>
        {loading ? (
          <p className="section-title">Pay in USD</p>
        ) : (
          <p className="section-title">Ticket Minted</p>
        )}
      </div>
      <Modal.Body>
        <Container fluid>
          <div className={styles.payCard}>
            {!mintModal ? (
              <>
                <div className={styles.checkOutDetailsDiv}>
                  {/* <div className={styles.checkOutDetails}>
                    <p>Discount</p>
                    <p>-10%</p>
                  </div>
                  <div className={styles.checkOutDetails}>
                    <p>Tax</p>
                    <p>+2%</p>
                  </div> */}
                  <div className={styles.checkOutDetailsTotal}>
                    <p>Total</p>
                    <p>{total} $</p>
                  </div>
                </div>

                <div className={styles.checkOutDetailsDiv}>
                  <div className={styles.checkOutDetails}>
                    <p className={styles.paymentTitle}>Choose paymnet method</p>
                  </div>
                  <div>
                    <input className="modalInput" value={"USD"} />
                    {/* <Dropdown>
                      <Dropdown.Toggle
                        variant="success"
                        id="dropdown-basic"
                        className="modalInput"
                        style={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        USD
                      </Dropdown.Toggle>

                      <Dropdown.Menu className={styles.drop}>
                        <Dropdown.Item
                          className={styles.drop}
                          href="#/action-1"
                        >
                          USDT
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown> */}
                  </div>
                  <div
                    className={styles.InputDiv}
                    style={{ marginTop: "12px" }}
                  >
                    <p className={styles.paymentTitle}>Card Number</p>
                    <input
                      id="CardNumber"
                      name="CardNumber"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.cardNumber}
                      className="modalInput"
                    />
                  </div>
                  <div style={{ height: "18px" }}>
                    {errors.cardNumber && touched.cardNumber ? (
                      <div className={styles.errors}>
                        <p className={styles.error}> {errors.cardNumber}</p>
                      </div>
                    ) : null}
                  </div>

                  <div className={styles.InputDiv}>
                    <p className={styles.paymentTitle}>Holder Name</p>
                    <input
                      id="HolderName"
                      name="HolderName"
                      type="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.holderName}
                      className="modalInput"
                    />
                  </div>
                  <div style={{ height: "18px" }}>
                    {errors.holderName && touched.holderName ? (
                      <div className={styles.errors}>
                        <p className={styles.error}> {errors.holderName}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
                <Row className={styles.holderInput}>
                  <Col>
                    <div className={styles.InputDiv}>
                      <p className={styles.paymentTitle}>CCV Code </p>
                      <input
                        id="Cvv"
                        name="Cvv"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.cvv}
                        className="modalInput"
                      />
                    </div>
                    <div style={{ height: "18px" }}>
                      {errors.cvv && touched.cvv ? (
                        <div className={styles.errors}>
                          <p className={styles.error}> {errors.cvv}</p>
                        </div>
                      ) : null}
                    </div>
                  </Col>
                  <Col>
                    <div className={styles.InputDiv}>
                      <p className={styles.paymentTitle}>Expire Date</p>
                      <input
                        id="Date"
                        name="Date"
                        type="date"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.date}
                        className="modalInput"
                      />
                    </div>
                    <div style={{ height: "18px" }}>
                      {errors.date && touched.date ? (
                        <div className={styles.errors}>
                          <p className={styles.error}> {errors.date}</p>
                        </div>
                      ) : null}
                    </div>
                  </Col>
                </Row>

                <div style={{ marginTop: "20px" }}>
                  <TickitButton
                    minWidth="100%"
                    style1
                    text="Pay"
                    onClick={() => {
                      custodialWallet();
                      localStorage.setItem(
                        "tickets",
                        JSON.stringify(cartItemData)
                      );
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={styles.checkOutDetailsDiv}>
                  {loading && (
                    <div className={styles.checkOutDetails}>
                      <p>Minting ... </p>
                      <p>Your NFT is being minted</p>
                    </div>
                  )}
                </div>
                <TickitButton
                  minWidth="100%"
                  style2
                  disabled={loading}
                  isLoading={loading}
                  text="Back to Home"
                  onClick={() => {
                    emptyCart();
                    router.push("/");
                  }}
                />
              </>
            )}
          </div>
        </Container>
      </Modal.Body>
    </Modal>
  );
};
export default PayUsd;
