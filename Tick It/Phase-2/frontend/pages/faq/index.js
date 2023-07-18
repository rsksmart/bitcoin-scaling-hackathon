import { Col, Row, Container } from "react-bootstrap";

import styles from "./faq.module.scss";

const FAQ = () => {
  const data = [
    {
      title: "How can I purchase tickets?",
      description:
        "To purchase tickets, simply visit our website and search for the event you're interested in. Select the desired event, choose the number of tickets you need, and proceed to the checkout page to complete your purchase.",
    },
    {
      title: "What payment methods are accepted?",
      description:
        "We accept major credit cards such as Visa, Mastercard, and American Express. Additionally, we may offer alternative payment methods like Crypto Payments.",
    },
    {
      title: "Can I get a refund if I can't attend the event?",
      description:
        "Refund policies vary depending on the event and the organizer. Generally, we follow the refund policy set by the event organizer. Please review the specific event's terms and conditions or contact our customer support for assistance with refunds.",
    },
    {
      title: "How do I receive my tickets?",
      description:
        "Once your purchase is complete, you can check your tickets on our platform inside your profile page or inside your crypto wallet.",
    },
    {
      title: "Are tickets transferable to another person?",
      description:
        "Ticket transferability depends on the event and the organizer's policies. Some events allow ticket transfers, while others may have restrictions in place. Check the event's terms and conditions or contact our customer support to inquire about ticket transferability.",
    },
    {
      title: "Are there any additional fees or charges?",
      description:
        "Ticket prices displayed on our platform usually include service fees and taxes.",
    },
    {
      title: "Can I resell my tickets on your platform?",
      description:
        "We do not currently support ticket resale on our platform. We encourage users to only purchase tickets through authorized channels to ensure their validity and avoid fraudulent activity.",
    },
    {
      title: "How can I contact customer support?",
      description:
        "If you have any questions, concerns, or need assistance, you can reach our customer support team through the Contact-Us page on our website. We strive to provide prompt and helpful assistance to our customers.",
    },
    {
      title: "How secure is my personal and payment information?",
      description:
        "We prioritize the security and confidentiality of your personal and payment information. Our platform employs industry-standard security measures, including encryption and secure data storage, to safeguard your data. For more details, please refer to our Privacy Policy and Terms of Service.",
    },
  ];

  return (
    <div className={styles.Wrapper}>
      <Container className={styles.aboutUs}>
        <div className={styles.container}>
          <p className="pageTitle">FAQ</p>
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
export default FAQ;
