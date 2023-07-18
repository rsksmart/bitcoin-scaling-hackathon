import { Col, Row, Container } from "react-bootstrap";

import styles from "./privacyPolicy.module.scss";

const PrivacyPolicy = () => {
  const data = [
    {
      title: "Personal Information:",
      description:
        "When you create an account or make a purchase, we may collect personal information, including your name, email address, phone number.",
    },
    {
      title: "Event Information:",
      description:
        "We collect information about the events you browse, purchase tickets for, or show interest in, including event names, dates, locations, and ticket quantities.",
    },
    {
      title: "Ticketing Services:",
      description:
        "We use your personal information to process ticket purchases, deliver tickets to you, and provide customer support related to your transactions.",
    },
    {
      title: "Communication:",
      description:
        "We may send you transactional emails, such as order confirmations and event updates. We may also send you promotional emails with your consent, which you can opt out of at any time.",
    },
    {
      title: "Platform Improvement:",
      description:
        "We analyze usage data to improve our platform, enhance user experience, and develop new features.",
    },
    {
      title: "Event Organizers:",
      description:
        "We share your personal information with event organizers to facilitate ticket purchases and provide customer support related to the events you attend.",
    },
    {
      title: "Service Providers:",
      description:
        "We may share your information with trusted third-party service providers who assist us in operating our platform, such as payment processors and email delivery services.",
    },
    {
      title: "Legal Requirements:",
      description:
        " We may disclose your information if required by law, court order, or governmental regulation, or if we believe disclosure is necessary to protect our rights, property, or safety, or the rights, property, or safety of others.",
    },
    {
      title: "Data Security:",
      description:
        "We implement reasonable security measures to protect your personal information from unauthorized access, use, alteration, or disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
    },
    {
      title: "Account Settings:",
      description:
        "You can review and update your personal information by accessing your account settings on our platform.",
    },
    {
      title: "Marketing Communications:",
      description:
        "You can opt out of receiving promotional emails by following the instructions provided in the emails or by contacting us directly.",
    },
    {
      title: "Children's Privacy:",
      description:
        "Our platform is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected personal information from a child under 13, we will take steps to delete it.",
    },
    {
      title: "Changes to this Privacy Policy:",
      description:
        "We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We encourage you to review this page periodically for the latest information on our privacy practices.",
    },
    {
      title: "Contact Us:",
      description:
        "If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us through the contact information provided on our platform.",
    },
  ];

  return (
    <div className={styles.Wrapper}>
      <Container className={styles.aboutUs}>
        <div className={styles.container}>
          <p className="pageTitle">Privacy Policy</p>
          <Row>
            <Col>
              <div className={styles.card}>
                {data?.map((item, index) => (
                  <div className={styles.aboutUsCard} key={index}>
                    <p className={styles.title}>{item.title} </p>
                    <p className={styles.aboutUsInfo}>{item.description}</p>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};
export default PrivacyPolicy;
