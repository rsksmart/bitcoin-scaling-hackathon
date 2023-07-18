import { Container, Modal } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

import { getReportTypes } from "../../axios/report.axios";
import { postReport } from "../../axios/report.axios";
import { useAuth } from "../../auth/useAuth";

import TickitButton from "../tickitButton";

import styles from "./ReportModal.module.scss";

const ReportModal = ({ id, setReportModal, reportEvent = false }) => {
  const [types, setTypes] = useState([]);
  const [typeError, setTypeError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeId, setTypeId] = useState([]);
  const [selectedValue, setSelectedValue] = useState();
  const [description, setDescription] = useState();

  const { user } = useAuth();

  const handleDropdownSelect = (eventKey) => {
    setSelectedValue(eventKey);
  };
  const handlePostReport = async () => {
    setTypeError(false);
    if (!selectedValue) {
      setTypeError(true);
    } else {
      setLoading(true);
      if (reportEvent) {
        postReport({
          userId: user.id,
          eventId: id,
          reportTypeId: typeId,
          description: description,
        }).then((data) => {
          setReportModal(false);
        });
      } else {
        postReport({
          userId: user.id,
          organizationId: id,
          reportTypeId: typeId,
          description: description,
        }).then((data) => {
          setReportModal(false);
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getReportTypes().then((data) => {
      setTypes(data.data);
    });
  }, [user]);
  return (
    <Modal show onHide={() => {}} centered>
      <Modal.Header
        onClick={() => {
          setReportModal(false);
        }}
        className={styles.closeButton}
        closeButton
      />
      <Container fluid>
        <div className={styles.reportTitle}>
          <p className="section-title">Report</p>
        </div>
        <div className={styles.container}>
          <p className={styles.title}>Reason for report</p>

          <div className={styles.dropdown}>
            <Dropdown
              onBlur={() => {
                if (!selectedValue) {
                  setTypeError(true);
                } else {
                  setTypeError(false);
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
                {selectedValue ? selectedValue : "Select Reason"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {types.map((type, index) => (
                  <Dropdown.Item
                    eventKey={type.name}
                    key={index}
                    onClick={() => {
                      setTypeId(type.id);
                    }}
                  >
                    {type.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div style={{ height: "20px" }}>
            {typeError ? (
              <div className={styles.errors}>
                <p className={styles.error}> Type is required field</p>
              </div>
            ) : null}
          </div>
          <div className={styles.reason}>
            <p className={styles.title}>Aditional reasons (optional)</p>
            <textarea
              className="modalInput"
              style={{ minHeight: "150px" }}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
          <div
            style={{
              marginTop: "24px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TickitButton
              onClick={() => {
                handlePostReport();
              }}
              text="send repport"
              loading={loading}
              disabled={loading || !selectedValue}
            />
          </div>
        </div>
      </Container>
    </Modal>
  );
};
export default ReportModal;
