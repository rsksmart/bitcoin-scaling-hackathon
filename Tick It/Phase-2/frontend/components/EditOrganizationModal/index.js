import { Container, Modal } from "react-bootstrap";

import TickitButton from "../tickitButton";

import styles from "./EditOrganizationModal.module.scss";

const EditOrganizationModal = ({ setEditOrganizationModal }) => {
  return (
    <Modal show onHide={() => {}} centered>
      <Modal.Header
        onClick={() => {
          setEditOrganizationModal(false);
        }}
        className={styles.closeButton}
        closeButton
      />
      <Container fluid>
        <div className={styles.reportTitle}>
          <p className="section-title">Edit Organization Profile</p>
        </div>
        <div style={{ marginTop: "24px" }}>
          <div style={{ width: "70%" }}>
            <input className="modalInput" placeholder="Organization Name" />
          </div>
          <div
            style={{
              display: "flex",

              alignItems: "center",
            }}
          >
            <input type="checkbox" onclick="myFunction()" />
            <p
              style={{
                marginBottom: "0",
              }}
            >
              Used Tickets
            </p>
          </div>
          <textarea
            className="modalInput"
            placeholder="Description"
            style={{ minHeight: "100px" }}
          />
        </div>
        <div className={styles.socialLink}>
          <p className={styles.socialTitle}>Social Links</p>
          <div className={styles.social} style={{ width: "70%" }}>
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
        </div>
        <div
          style={{
            paddingBottom: "24px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TickitButton text="edit" />
        </div>
      </Container>
    </Modal>
  );
};
export default EditOrganizationModal;
