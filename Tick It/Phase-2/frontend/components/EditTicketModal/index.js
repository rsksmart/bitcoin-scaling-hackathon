import React, { useState, useEffect } from "react";
import { Modal, Container, Row, Col, Form } from "react-bootstrap";

import { useFormik } from "formik";
import * as yup from "yup";

import { use721 } from "../../hooks/use721";
import { postEventTicketTypeBatch } from "../../axios/eventTicketType.axios";

import Dropzone from "../../components/Dropzone";
import TickitButton from "../tickitButton";

import styles from "./EditTicket.module.scss";

const EditTicketModal = ({
  setEditTicket,
  ticketDetails,
  allTickets,
  setRefetchEvent,
  contractAddress,
}) => {
  const [imageError, setImageError] = useState(false);
  const [filePreview, setFilePreview] = useState(ticketDetails?.image);
  const [nameError, setNameError] = useState(false);
  const [image, setImage] = useState(ticketDetails?.image);
  const [loading, setLoading] = useState(false);

  const {
    editTicketPrice,
    editTicketPriceState,
    editTicketPriceEvents,
    resetEditTicketPrice,
  } = use721({ contractAddress });

  const editTicket = () => {
    let ticketTypeId = ticketDetails?.ticketTypeId;

    editTicketPrice([ticketTypeId, values.price * 10 ** 18], {
      gasPrice: Number(process.env.NEXT_PUBLIC_GAS_PRICE),
      gasLimit: Number(process.env.NEXT_PUBLIC_GAS_LIMIT),
    });
  };

  const launchRes = async () => {
    let ticketsData = {
      eventId: allTickets[0].eventId,
      id: ticketDetails?.id,
      name: values.name,
      price: values.price * 10 ** 18,
      description: values.description,
      image: image,
    };
    postEventTicketTypeBatch(ticketsData).then(() => {
      setEditTicket(false);
      setLoading(false);
      setRefetchEvent(Date.now());
    });
  };

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
    description: yup.string().required(),
  });
  const formik = useFormik({
    initialValues: {
      name: ticketDetails?.name,
      price: ticketDetails?.price / 10 ** 18,
      description: ticketDetails?.description,
      image: ticketDetails?.image,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (image) {
        setImageError(false);
        values.image = image;
        let found = allTickets.find(
          (ticket) =>
            ticket?.name?.toLowerCase() == values?.name?.toLowerCase() &&
            ticket.ticketTypeId != ticketDetails?.ticketTypeId
        );
        if (found) {
          setNameError(true);
        } else {
          setNameError(false);
          editTicket();
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

  useEffect(() => {
    if (
      editTicketPriceState.status == "PendingSignature" ||
      editTicketPriceState.status == "Mining"
    ) {
      setLoading(true);
    }
    if (editTicketPriceState.status == "Success") launchRes();
  }, [editTicketPriceState]);

  return (
    <Form>
      <Modal show onHide={() => {}} centered>
        <Modal.Header
          onClick={() => {
            setEditTicket(false);
          }}
          className={styles.closeButton}
          closeButton
        />

        <Modal.Body>
          <Container>
            <p className={styles.title}>Edit Ticket</p>

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
              <TickitButton
                isLoading={loading}
                disabled={loading}
                onClick={handleSubmit}
                text="Edit TICKET"
              />
            </div>
          </Container>
        </Modal.Body>
      </Modal>
    </Form>
  );
};
export default EditTicketModal;
