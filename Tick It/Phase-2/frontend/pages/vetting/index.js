import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";

import { useFormik } from "formik";
import * as yup from "yup";

import { useAuth } from "../../auth/useAuth";
import { postOrganization } from "../../axios/organization.axios";
import { useAuthModalContext } from "../../context/AuthModalProvider";
import { getOrganization } from "../../axios/organization.axios";

import EventDetails from "../../components/EventDetails";
import TickitButton from "../../components/tickitButton";
import Dropzone from "../../components/Dropzone";
import Loader from "../../components/loader/loader";

import styles from "./Vetting.module.scss";

const Vetting = () => {
  const [bannerPreview, setBannerPreview] = useState();
  const [profilePreview, setProfilePreview] = useState();
  const [ownerId, setOwnerId] = useState();
  const [bannerImageError, setBannerImageError] = useState(false);
  const [profileImageError, setProfileImageError] = useState(false);
  const [bannerImage, setBannerImage] = useState();
  const [profileImage, setProfileImage] = useState();
  const [loading, setLoading] = useState(true);

  const { setModalOpen } = useAuthModalContext();
  const { user } = useAuth();
  const router = useRouter();
  const { newOrg } = router.query;

  const handleRouting = async () => {
    if (user) {
      setOwnerId(user.id);
      getOrganizationDetails(user.id);
    } else {
      setModalOpen(true);
      let userDetails = await user;
      if (userDetails) {
        getOrganizationDetails(userDetails.id);
      }
    }
  };

  const getOrganizationDetails = async (id) => {
    let tempOrg = await getOrganization(
      JSON.stringify({
        where: { ownerId: id },
      })
    );
    if (!newOrg) {
      if (tempOrg?.data.length) {
        if (tempOrg?.data?.length == 1) {
          if (tempOrg.data[0].isVetted) {
            router.push({
              pathname: "/create-event",
              query: { orgId: tempOrg.data[0].id },
            });
          } else {
            router.push("/vetting/applications");
          }
        } else {
          router.push("/vetting/applications");
        }
      } else {
        router.push("/vetting");
      }
    }
    setLoading(false);
  };

  const schema = yup.object().shape({
    name: yup
      .string()
      .min(3, "Must be 3 characters or more")
      .max(45, "Must be 45 character or less")
      .required("Name is a required field"),
    description: yup.string().required(),
    eventKind: yup.string().required("This field is required"),
  });
  const formik = useFormik({
    initialValues: {
      ownerId: "",
      name: "",
      profile: profileImage,
      banner: bannerImage,
      description: "",
      eventKind: "",
    },
    validationSchema: schema,

    onSubmit: (values) => {
      values.ownerId = ownerId;
      if (bannerImage) {
        setBannerImageError(false);
        values.banner = bannerImage;
        if (profileImage) {
          setProfileImageError(false);
          values.profile = profileImage;

          postOrganization({
            ownerId: values.ownerId,
            name: values.name,
            profile: values.profile,
            banner: values.banner,
            vettingObj: JSON.stringify({
              name: values.name,
              profile: values.profile,
              banner: values.banner,
              description: values.description,
              eventKind: values.eventKind,
            }),
          }).then((data) => {
            router.push("/vetting/applications");
          });
        } else {
          setProfileImageError(true);
        }
      } else {
        setBannerImageError(true);
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
    handleRouting();
  }, [user]);

  return (
    <div className={styles.wrapper}>
      {!loading ? (
        <Container style={{ padding: "50px  10px" }}>
          <p className="pageTitle">Become an organizer</p>
          <EventDetails details=" Lorem ipsum dolor sit amet, consecteur adipscing elit, sed do eiusmod tempor incididunt ut labore et dolor magna aliqua" />
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div>
              <div style={{ marginTop: "24px " }}>
                <Dropzone
                  filePreview={bannerPreview}
                  setFilePreview={setBannerPreview}
                  setImage={setBannerImage}
                  text="Banner (max 1MB)"
                />
                <div style={{ height: "20px" }}>
                  {bannerImageError ? (
                    <div className={styles.errors}>
                      <p className={styles.error}>Banner image is required</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div>
              <div style={{ marginTop: "24px " }}>
                <Dropzone
                  filePreview={profilePreview}
                  setFilePreview={setProfilePreview}
                  setImage={setProfileImage}
                  text="Profile (max 1MB)"
                />
                <div style={{ height: "20px" }}>
                  {profileImageError ? (
                    <div className={styles.errors}>
                      <p className={styles.error}>Profile image is required</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.inputDiv} style={{ width: "35%" }}>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Organization Name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              className="modalInput"
            />
          </div>
          <div style={{ minHeight: "20px" }}>
            {errors.name && touched.name ? (
              <div className={styles.errors}>
                <p className={styles.error}> {errors.name}</p>
              </div>
            ) : null}
          </div>

          {/* <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              className={styles.roundCheckbox}
              type="checkbox"
              onclick="myFunction()"
            />
            <p className={styles.checkboxText}>
              I want to create events in my own name
            </p>
          </div> */}
          <div className={styles.descriptionDiv} style={{ width: "60%" }}>
            <textarea
              id="description"
              name="description"
              type="text"
              placeholder="Description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              className="modalInput"
              style={{ minHeight: "170px" }}
            />
          </div>
          <div style={{ minHeight: "20px" }}>
            {errors.description && touched.description ? (
              <div className={styles.errors}>
                <p className={styles.error}> {errors.description}</p>
              </div>
            ) : null}
          </div>

          {/* <div className={styles.socialLink}>
            <p className={styles.socialTitle}>Social Links</p>
            <div className={styles.social} style={{ width: "35%" }}>
              <p className={styles.socialName}>Telegram</p>
              <input className="modalInput" />
              <p className={styles.socialName}>Instagram</p>
              <input className="modalInput" />
              <p className={styles.socialName}>Twitter</p>
              <input className="modalInput" />
              <p className={styles.socialName}>Discord</p>
              <input className="modalInput" />
              <p className={styles.socialName}>Website</p>
              <input className="modalInput" />
            </div>
          </div> */}
          <div className={styles.descriptionDiv} style={{ width: "60%" }}>
            <textarea
              id="eventKind"
              name="eventKind"
              type="text"
              placeholder="What kind of events will you creating ?"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.eventKind}
              className="modalInput"
              style={{ minHeight: "170px" }}
            />
          </div>
          <div style={{ minHeight: "20px" }}>
            {errors.eventKind && touched.eventKind ? (
              <div className={styles.errors}>
                <p className={styles.error}> {errors.eventKind}</p>
              </div>
            ) : null}
          </div>

          <div className={styles.submitBtn}>
            <TickitButton onClick={handleSubmit} text="SUBMIT" />
          </div>
        </Container>
      ) : (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Vetting;
