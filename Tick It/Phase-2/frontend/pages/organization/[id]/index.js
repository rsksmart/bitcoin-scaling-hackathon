
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";

import { getOrganization } from "../../../axios/organization.axios";

import UserProfileDetails from "../../../components/UserProfileDetails";
import OrganizationSidebar from "../../../components/OrganizationSidebar";
import OrganizationEvents from "../../../components/OrganizationEvents";
import OrganizationTeam from "../../../components/OrganizationTeam";
import OrganizationSettings from "../../../components/OrganizationSettings";
import ComingSoonModal from '../../../components/ComingSoonModal'

import styles from "./organization.module.scss";

const Organization = () => {
   let menu = 'team'
  const [orgData, setOrgData] = useState();
  const router = useRouter();
  const { id } = router.query;
   const [comingSoon, setComingSoon] = useState(true)


  const getOrganizationDetails = async () => {
    await getOrganization(
      JSON.stringify({
        // relations: [],
        where: { id: id },


      }),
    ).then((data) => {
      setOrgData(data.data[0])
    })
  }

  useEffect(() => {
    if (id) {
      getOrganizationDetails()
    }
  }, [id])

  return (
    <>
      {comingSoon && <ComingSoonModal></ComingSoonModal>}

      <Container fluid className={styles.organization}>
        <Row>
          <UserProfileDetails data={orgData} />
        </Row>
        <Row>
          <Col lg={3} style={{ padding: '0px' }}>
            <OrganizationSidebar />
          </Col>
          {menu == 'allevent' && (
            <Col lg={9} style={{ padding: '15px 0px' }}>
              <OrganizationEvents />
            </Col>
          )}
          {menu == 'team' && (
            <Col lg={9} style={{ padding: '15px 0px' }}>
              <OrganizationTeam />
            </Col>
          )}
          {menu == 'payment' && (
            <Col lg={9} style={{ padding: '15px 0px' }}>
              <OrganizationSettings />
            </Col>
          )}
        </Row>
      </Container>
    </>
  )
}
export default Organization

