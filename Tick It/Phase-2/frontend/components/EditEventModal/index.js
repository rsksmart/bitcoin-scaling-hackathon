import React, { useState, useEffect } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import { useRouter } from "next/router";

import { useFormik } from "formik";
import * as yup from "yup";

import { getCategories } from "../../axios/event.axios";
import { getOrganization } from "../../axios/organization.axios";
import { postEvent } from "../../axios/event.axios";
import { useAuth } from "../../auth/useAuth";
import { useAuthModalContext } from "../../context/AuthModalProvider";

import Dropzone from "../Dropzone";
import TickitButton from "../tickitButton";

import styles from "./EditEventModal.module.scss";

const EditEventModal = ({
  setEditEventModal,
  symbol,
  id,
  isPublished,
  eventDetails,
  setRefetchEvent,
}) => {
  const [imageError, setImageError] = useState(false);
  const [image, setImage] = useState(eventDetails.banner);
  const [filePreview, setFilePreview] = useState(eventDetails.banner);
  const [categoryError, setCategoryError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedValue, setSelectedValue] = useState(
    eventDetails.category.name
  );
  const [categoryId, setCategoryId] = useState(eventDetails.category.id);
  const [organization, setOrganization] = useState("");

  const router = useRouter();
  const { user } = useAuth();
  const { setModalOpen } = useAuthModalContext();

  const handleDropdownSelect = (eventKey) => {
    setSelectedValue(eventKey);
  };
  const getOrganizationDetails = async (id) => {
    let organization = await getOrganization(
      JSON.stringify({
        where: { ownerId: id },
      })
    );
    setOrganization(organization.data[0]);
  };

  const postCreateEvent = async () => {
    postEvent({
      id: id,
      name: values.name,
      description: values.description,
      eventDate: values.date,
      location: values.location,
      symbol: symbol,
      banner: values.banner,
      media: "",
      urls: "",
      categoryId: categoryId,
      organizationId: organization.id,
    }).then((data) => {
      router.push(
        isPublished ? `/event/${data.slug}` : `/add-tickets/${data.id}`
      );

      setRefetchEvent(Date.now());
      setEditEventModal(false);
    });
  };

  const schema = yup.object().shape({
    name: yup.string().required(),
    date: yup.date().required(),
    location: yup.string().required(),
    description: yup.string().required(),
  });
  const formik = useFormik({
    initialValues: {
      name: eventDetails.name,
      date: "",
      location: eventDetails.location,
      description: eventDetails.description,
      banner: eventDetails.banner,
      category: eventDetails.category.name,
    },
    validationSchema: schema,
    onSubmit: async () => {
      if (image) {
        setImageError(false);
        values.banner = image;
        if (selectedValue) {
          setCategoryError(false);
          values.category = selectedValue;
          postCreateEvent();
        } else {
          setCategoryError(true);
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
    if (!user) {
      setModalOpen(true);
    } else {
      getCategories().then((data) => {
        setCategories(data.data);
      });
      getOrganizationDetails(user?.id);
      setModalOpen(false);
    }
  }, [user]);

  return (
    <Modal show onHide={() => {}} centered>
      <Modal.Header
        onClick={() => {
          setEditEventModal(false);
        }}
        className={styles.closeButton}
        closeButton
      />

      <Modal.Body>
        <Container>
          <p className={styles.title}>Edit Event</p>

          <Row>
            <div className={styles.drop}>
              <Dropzone
                filePreview={filePreview}
                setFilePreview={setFilePreview}
                setImage={setImage}
                text="Banner (max 1MB)"
              />
              {imageError ? (
                <div className={styles.errors}>
                  <p className={styles.error2}> Image is required field</p>
                </div>
              ) : null}
            </div>
          </Row>
          <Row>
            <div className={styles.InputDiv}>
              <p className={styles.detailsTitle}>Name</p>
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
            </div>
            <div className={styles.InputDiv}>
              <p className={styles.detailsTitle}>Location</p>
              <input
                id="location"
                name="location"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.location}
                className="modalInput"
                style={{ color: "#656565" }}
              />
            </div>
            <div style={{ height: "20px" }}>
              {errors.location && touched.location ? (
                <div className={styles.errors}>
                  <p className={styles.error2}> {errors.location}</p>
                </div>
              ) : null}
            </div>
            <div className={styles.InputDiv}>
              <p className={styles.detailsTitle}>Date</p>
              <input
                id="date"
                name="date"
                type="datetime-local"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.date}
                className="modalInput"
                style={{ color: "#656565" }}
              />
            </div>
            <div style={{ height: "20px" }}>
              {errors.date && touched.date ? (
                <div className={styles.errors}>
                  <p className={styles.error2}> {errors.date}</p>
                </div>
              ) : null}
            </div>
            <div className={styles.InputDiv}>
              <p className={styles.detailsTitle}>Category</p>
              <Dropdown
                onBlur={() => {
                  if (!selectedValue) {
                    setCategoryError(true);
                  } else {
                    setCategoryError(false);
                  }
                }}
                onSelect={handleDropdownSelect}
              >
                <Dropdown.Toggle
                  className="modalInput"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  variant="success"
                  id="dropdown-basic"
                >
                  {selectedValue ? selectedValue : "Select Event Category"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {categories.map((category, index) => (
                    <Dropdown.Item
                      eventKey={category.name}
                      key={index}
                      onClick={() => {
                        setCategoryId(category.id);
                      }}
                    >
                      {category.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div style={{ height: "20px" }}>
              {categoryError ? (
                <div className={styles.errors}>
                  <p className={styles.error2}> Category is required field</p>
                </div>
              ) : null}
            </div>
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
            <TickitButton style1 text="Edit Event" onClick={handleSubmit} />
          </div>
        </Container>
      </Modal.Body>
    </Modal>
  );
};
export default EditEventModal;
