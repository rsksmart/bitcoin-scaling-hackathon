import { Container, Col, Row } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useAuth } from '../../../auth/useAuth'

import ActivityCard from '../../../components/ActivityCard'
import DashboardBar from '../../../components/DashboardBar'

import styles from './activity.module.scss'

const Activity = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [comingSoon, setComingSoon] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user])

  return (
    <Container fluid className="dashboardWrapper">
      <Row>
        <Col lg={2} style={{ padding: '0px' }}>
          <DashboardBar selected="activity" />
        </Col>
        {comingSoon ? (
          <Col>
            <Container fluid>
              <div>
                <p className={styles.customHeading}>
                  This Feature is coming soon! Stay Tuned!
                </p>
              </div>
            </Container>
          </Col>
        ) : (
          <Col lg={10} style={{ padding: '0px' }}>
            <Container fluid>
              <div className={styles.title}>
                <p className="pageTitle">Activity</p>
              </div>
              <Row>
                <Col>
                  <div className={styles.activityCard}>
                    {/* Activity Cards */}
                    <ActivityCard
                      date="Wednesday 4 April 2023"
                      time="11:34 AM"
                      info="Bought 3 tickets for ACDC Live"
                      highlight="ACDC Live"
                    />
                    <ActivityCard
                      date="Wednesday 4 April 2023"
                      time="11:35 AM"
                      info="Sent 2 ACDC Live tickets to Edward Erdoğan"
                      highlight="ACDC Live"
                      highlightName="Edward Erdoğan"
                    />

                    {/* Repeat more activity cards here */}
                  </div>

                  {/* Additional Activity Card */}
                  <div className={styles.activityCard2}>
                    <p className={styles.activityDate}>
                      Wednesday 4 April 2023
                    </p>
                    <ActivityCard
                      time="11:34 AM"
                      info="Bought 3 tickets for "
                      highlight="ACDC Live"
                    />
                    <ActivityCard
                      time="11:35 AM"
                      info="Sent 2 ACDC Live tickets to Ginestra Zelensky"
                      highlight="ACDC Live"
                      highlightName="Ginestra Zelensky"
                    />
                    {/* Add more activity cards here */}
                  </div>
                </Col>
              </Row>
            </Container>
          </Col>
        )}
      </Row>
    </Container>
  )
}

export default Activity
