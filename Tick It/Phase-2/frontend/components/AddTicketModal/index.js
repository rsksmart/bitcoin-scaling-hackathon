import React, { useState } from "react";
import { Modal, Container, Row, Col, Form } from "react-bootstrap";

import { useFormik } from "formik";
import * as yup from "yup";

import Dropzone from "../../components/Dropzone";
import TickitButton from "../tickitButton";

import styles from "./AddTicketModal.module.scss";

const AddTicketModal = ({ setAddTicketModal, setTickets, tickets }) => {
  // Use States
  const [imageError, setImageError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [filePreview, setFilePreview] = useState();
  const [image, setImage] = useState();

  const schema = yup.object().shape({
    name: yup.string().required(),
    price: yup
      .number()
      .required()
      .test(
        "Is positive?",
        "ERROR: The number must be greater than 0!",
        (value) => value > 0
      ),
    supply: yup.number().required(),
    description: yup.string().required(),
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      supply: "",
      description: "",
      image: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (image) {
        setImageError(false);
        values.image = image;
        let found = tickets.find(
          (ticket) => ticket?.name?.toLowerCase() == values?.name?.toLowerCase()
        );
        if (found) {
          setNameError(true);
        } else {
          setNameError(false);
          setTickets([...tickets, values]);
          setAddTicketModal(false);
        }
      } else {
        setImageError(true);
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
  return (
    <Form>
      <Modal show onHide={() => {}} centered>
        <Modal.Header
          onClick={() => {
            setAddTicketModal(false);
          }}
          className={styles.closeButton}
          closeButton
        />

        <Modal.Body>
          <Container>
            <p className={styles.title}>Add Ticket</p>

            <Row>
              <Col md={4}>
                <div
                  className={styles.drop}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <Dropzone
                    filePreview={filePreview}
                    setFilePreview={setFilePreview}
                    setImage={setImage}
                    text="Image (max 1MB)"
                  />
                  <div style={{ height: "20px" }}>
                    {imageError ? (
                      <div className={styles.errors}>
                        <p className={styles.error2}>Image is required field</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Col>
              <Col md={8}>
                <div className={styles.InputDiv}>
                  <p className={styles.detailsTitle}>Ticket title</p>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    className="modalInput"
                    style={{ color: "#656565" }}
                  />
                </div>
                <div style={{ minHeight: "20px" }}>
                  {errors.name && touched.name ? (
                    <div className={styles.errors}>
                      <p className={styles.error2}> {errors.name}</p>
                    </div>
                  ) : null}
                  {nameError && (
                    <div className={styles.errors}>
                      <p className={styles.error2}>
                        You already have a ticket with this name
                      </p>
                    </div>
                  )}
                </div>

                <div className={styles.InputDiv}>
                  <p className={styles.detailsTitle}>Number of tickets</p>
                  <input
                    id="supply"
                    name="supply"
                    type="number"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.supply}
                    className="modalInput"
                    style={{ color: "#656565" }}
                  />
                </div>
                <div style={{ minHeight: "20px" }}>
                  {errors.supply && touched.supply ? (
                    <div className={styles.errors}>
                      <p className={styles.error2}> {errors.supply}</p>
                    </div>
                  ) : null}
                </div>

                <div className={styles.InputDiv}>
                  <p className={styles.detailsTitle}>Set price (ETH)</p>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.price}
                    className="modalInput"
                    style={{ color: "#656565" }}
                  />
                </div>
                <div style={{ minHeight: "20px" }}>
                  {errors.price && touched.price ? (
                    <div className={styles.errors}>
                      <p className={styles.error2}> {errors.price}</p>
                    </div>
                  ) : null}
                </div>
              </Col>
            </Row>

            <Row className={styles.holderInput}>
              <div className={styles.InputDiv}>
                <p className={styles.detailsTitle}>Description</p>
                <textarea
                  id="description"
                  name="description"
                  type="text"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.description}
                  className="modalInput"
                  style={{ color: "#656565" }}
                />
              </div>
              <div style={{ minHeight: "20px" }}>
                {errors.description && touched.description ? (
                  <div className={styles.errors}>
                    <p className={styles.error2}> {errors.description}</p>
                  </div>
                ) : null}
              </div>
            </Row>
            <div className={styles.buttonAdd}>
              <TickitButton onClick={handleSubmit} text="ADD TICKET" />
            </div>
          </Container>
        </Modal.Body>
      </Modal>
    </Form>
  );
};
export default AddTicketModal;
