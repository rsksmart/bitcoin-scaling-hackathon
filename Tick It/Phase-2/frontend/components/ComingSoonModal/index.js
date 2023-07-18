import React from 'react'
import { Container, Modal } from 'react-bootstrap'
import styles from "./ComingSoon.module.scss";
import { useRouter } from 'next/router';


const ComingSoonModal = () => {
    const router = useRouter()

    const handleCloseModal = () => {
        router.push("/user/dashboard")
    }
  return (
    <Modal show onHide={() => {}} centered>
      <Modal.Header closeButton onClick={handleCloseModal}>
        <Container>
          <div className={styles.reportTitle}>
            <p className="section-title">Feature Coming Soon</p>
          </div>
        </Container>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <Container>
          <div className={styles.reportTitle}>
            <p>We are currently working on this feature!</p>
          </div>
        </Container>
      </Modal.Body>
    </Modal>
  )
}

export default ComingSoonModal
