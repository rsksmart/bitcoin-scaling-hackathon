import { Container, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useRouter } from "next/router";

import * as yup from "yup";
import { useFormik } from "formik";

import { getCategories } from "../../axios/event.axios";
import { getOrganization } from "../../axios/organization.axios";
import { postEvent } from "../../axios/event.axios";
import { useAuthModalContext } from "../../context/AuthModalProvider";
import { useAuth } from "../../auth/useAuth";

import TickitButton from "../../components/tickitButton";
import Dropzone from "../../components/Dropzone";

import styles from "./createEvent.module.scss";

const CreateEvent = () => {
  // States
  const [filePreview, setFilePreview] = useState();
  const [imageError, setImageError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [organizationError, setOrganizationError] = useState(false);
  const [image, setImage] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState();
  const [organizationbyId, setOrganizationbyId] = useState();
  const [selectedOrganization, setSelectedOrganization] = useState();
  const [categoryId, setCategoryId] = useState("");

  // Hooks
  const router = useRouter();
  const { orgId } = router.query;
  const { user } = useAuth();
  const { setModalOpen } = useAuthModalContext();

  // Functions
  const getOrganizationDetails = async (id) => {
    let tempOrg = await getOrganization(
      JSON.stringify({
        where: { ownerId: id },
      })
    );
    setOrganizations(tempOrg.data);
  };
  const getOrganizationById = async (id) => {
    let tempOrg = await getOrganization(
      JSON.stringify({
        where: { id: id },
      })
    );
    setOrganizationbyId(tempOrg.data);
  };

  const postCreateEvent = async () => {
    postEvent({
      name: values.name,
      symbol: values.symbol,
      description: values.description,
      eventDate: values.date,
      location: values.location,
      banner: values.banner,
      media: "",
      urls: "",
      categoryId: categoryId,
      organizationId: orgId
        ? organizationbyId[0].id
        : organizations.length > 1
        ? selectedOrganization.id
        : organizations[0].id,
    }).then((data) => {
      router.push(`/add-tickets/${data.id}`);
    });
  };

  const handleDropdownSelect = (eventKey) => {
    setSelectedValue(eventKey);
  };
  const handleOrganizationSelect = (eventKey) => {
    setSelectedOrganization(eventKey);
  };

  const schema = yup.object().shape({
    name: yup.string().required(),
    symbol: yup.string().max(3).required(),
    date: yup.date().required(),
    location: yup.string().required(),
    description: yup.string().required(),
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      symbol: "",
      date: "",
      location: "",
      description: "",
      banner: "",
      category: "",
    },
    validationSchema: schema,
    onSubmit: async () => {
      if (image) {
        setImageError(false);
        values.banner = image;
        if (selectedValue) {
          setCategoryError(false);
          values.category = selectedValue;
          if (orgId) {
            postCreateEvent();
          } else if (selectedOrganization) {
            setOrganizationError(false);
            postCreateEvent();
          } else {
            setOrganizationError(true);
          }
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

  // Use Effects
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
  useEffect(() => {
    if (orgId) {
      getOrganizationById(orgId);
    }
  }, [orgId]);

  return (
    <div className={styles.Wrapper}>
      <Form>
        <Container style={{ paddingTop: "24px", paddingBottom: "48px" }}>
          <p className="pageTitle">Create Event</p>

          <div style={{ marginTop: "48px" }}>
            <p className="section-title">Event Details</p>
            <div style={{ marginTop: "24px " }}>
              <p className={styles.title}>Organization Name</p>
              {!orgId ? (
                organizations &&
                organizations.length > 1 && (
                  <>
                    <div className={styles.InputDiv}>
                      <Dropdown
                        onBlur={() => {
                          if (!selectedOrganization) {
                            setOrganizationError(true);
                          } else {
                            setOrganizationError(false);
                          }
                        }}
                        onSelect={handleOrganizationSelect}
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
                          {selectedOrganization
                            ? selectedOrganization
                            : "Select Organization"}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          {organizations.map((organization, index) => (
                            <Dropdown.Item
                              eventKey={organization.name}
                              key={index}
                              onClick={() => {
                                setCategoryId(organization.id);
                              }}
                            >
                              {organization.name}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div style={{ height: "20px" }}>
                      {organizationError ? (
                        <div className={styles.errors}>
                          <p className={styles.error}>
                            Organization is required field
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </>
                )
              ) : (
                <div className={styles.InputDiv}>
                  <input
                    type="text"
                    disabled
                    value={organizationbyId && organizationbyId[0]?.name}
                    className="modalInput"
                    style={{ color: "#656565" }}
                  />
                </div>
              )}
            </div>
            <div style={{ marginTop: "24px ", width: "fit-content" }}>
              <Dropzone
                filePreview={filePreview}
                setFilePreview={setFilePreview}
                setImage={setImage}
                text="Banner (max 1MB)"
              />
              <div style={{ height: "20px" }}>
                {imageError ? (
                  <div className={styles.errors}>
                    <p className={styles.error}> Image is required field</p>
                  </div>
                ) : null}
              </div>
            </div>

            <p className={styles.title}>Name</p>
            <div className={styles.InputDiv}>
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
            <div style={{ height: "20px" }}>
              {errors.name && touched.name ? (
                <div className={styles.errors}>
                  <p className={styles.error}> {errors.name}</p>
                </div>
              ) : null}
            </div>

            <p className={styles.title}>Symbol</p>
            <div className={styles.InputDiv}>
              <input
                id="symbol"
                name="symbol"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.symbol}
                className="modalInput"
                style={{ color: "#656565" }}
              />
            </div>
            <div style={{ height: "20px" }}>
              {errors.symbol && touched.symbol ? (
                <div className={styles.errors}>
                  <p className={styles.error}> {errors.symbol}</p>
                </div>
              ) : null}
            </div>

            <p className={styles.title}>Date & Time</p>
            <div className={styles.InputDiv}>
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
                  <p className={styles.error}> {errors.date}</p>
                </div>
              ) : null}
            </div>

            <p className={styles.title}>Location</p>
            <div className={styles.InputDiv}>
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
                  <p className={styles.error}> {errors.location}</p>
                </div>
              ) : null}
            </div>
            <p className={styles.title}>Category</p>
            <div className={styles.InputDiv}>
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
                  <p className={styles.error}> Category is required field</p>
                </div>
              ) : null}
            </div>
            <p style={{ marginTop: "16px" }} className={styles.title}>
              Description
            </p>
            <div className={styles.descriptionDiv}>
              <textarea
                id="description"
                name="description"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
                className="modalInput"
                style={{ minHeight: "170px" }}
              />
            </div>
            <div style={{ height: "20px" }}>
              {errors.description && touched.description ? (
                <div className={styles.errors}>
                  <p className={styles.error}> {errors.description}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className={styles.appButton}>
            <TickitButton onClick={handleSubmit} text="CREATE" />
          </div>
        </Container>
      </Form>
    </div>
  );
};
export default CreateEvent;
