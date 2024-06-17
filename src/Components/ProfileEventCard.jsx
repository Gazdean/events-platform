import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { handleFormatDate } from '../utils';

export default function ProfileEventCard({ event }) {
  
  useEffect(() => {
    const eventStart = event.start.utc
    const eventEnd = event.end.utc
    setDateObj(handleFormatDate(eventStart, eventEnd));
  }, [event]);

  return (
    <Card xs={6}>
      <Row xs={6} className="p-3">
        <Row >{event.name.text}</Row>     
        <Col>Date: {dateObj.startDate}</Col>
        <Col>
          <Link to={`/event/${event.id}`}><Button>View Event</Button></Link>
        </Col>
      </Row>
    </Card>
  );
}

