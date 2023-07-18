import React, { useEffect, useState } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { useRouter } from 'next/router'

import { useAuth } from '../../../auth/useAuth'

import DashboardBar from '../../../components/DashboardBar'
import CartTicket from '../../../components/CartTicket'
import Loader from '../../../components/loader/loader'

import styles from './attendance.module.scss'

const Attendance = () => {
  const [tickets, setTickets] = useState([])

  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    let temp = localStorage.getItem('tickets')
    let tickets = JSON.parse(temp)
    setTickets(tickets)
  }, [])

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user])

  return (
    <Container fluid className={styles.wrapper}>
      <Row>
        <Col lg={2} style={{ padding: '0px' }}>
          <DashboardBar selected="attendance" />
        </Col>
        <Col lg={10} style={{ padding: '40px 10px' }}>
          <Container fluid>
            <Row>
              <p className="pageTitle" style={{ marginBottom: '24px' }}>
                Attendance
              </p>
              {tickets?.length > 0 ? (
                <>
                  {tickets?.map((event, index) => (
                    <CartTicket key={index} itemData={event} />
                  ))}
                </>
              ) : (
                <div>
                  <Col>
                    <Container fluid>
                      <div>
                        <p className={styles.customHeading}>
                          This Feature is coming soon! Stay Tuned!
                        </p>
                      </div>
                    </Container>
                  </Col>
                </div>
              )}
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  )
}

export default Attendance
