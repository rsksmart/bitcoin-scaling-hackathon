import { Col, Row, Container } from "react-bootstrap";

import styles from "./terms-and-conditions.module.scss";

const TermsAndConditions = () => {
  const data = [
    {
      title: "Availability:",
      description:
        "The Platform enables you to browse and purchase tickets for various events, shows, concerts, or other activities (Events) listed on the Platform. Company does not guarantee the availability of any specific tickets or Events.",
    },
    {
      title: "Ticket Descriptions:",
      description:
        "The Platform provides information regarding Events, including ticket prices, dates, and times. While Company strives to ensure accuracy, Event details, including ticket availability and pricing, may be subject to change without notice.",
    },
    {
      title: "Ticket Purchase and Payment:",
      description:
        "To purchase tickets, you may be required to create an account on the Platform and provide accurate and complete information. Payment for tickets is processed through secure payment gateways, and you agree to abide by the terms and conditions of the respective payment providers.",
    },
    {
      title: "Eligibility:",
      description:
        "By using the Platform, you represent that you are at least 18 years old or have the legal capacity to enter into binding contracts in your jurisdiction.",
    },
    {
      title: "Account Security:",
      description:
        "You are responsible for maintaining the confidentiality of your account login credentials. You agree to notify Company immediately of any unauthorized use of your account or any other security breach.",
    },
    {
      title: "Intellectual Property:",
      description:
        "The Platform and its content, including logos, trademarks, text, graphics, images, and software, are owned or licensed by Company and protected by intellectual property laws. You agree not to modify, reproduce, distribute, or create derivative works based on the Platform without Company's prior written consent.",
    },
    {
      title: "Limitation of Liability:",
      description:
        "Company does not guarantee the accuracy, completeness, or availability of the Platform, Events, or any related content. You agree that your use of the Platform is at your own risk.",
    },
    {
      title: "Modification and Termination:",
      description:
        "Company reserves the right to modify or update these Terms at any time, with or without notice. Continued use of the Platform after any such changes constitutes your acceptance of the modified Terms.",
    },
    {
      title: "Governing Law and Dispute Resolution:",
      description:
        "These Terms shall be governed by and construed in accordance with the laws of the country.",
    },
  ];

  return (
    <div className={styles.Wrapper}>
      <Container className={styles.aboutUs}>
        <div className={styles.container}>
          <p className="pageTitle">Terms And Conditions</p>
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
export default TermsAndConditions;
