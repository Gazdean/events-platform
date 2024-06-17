import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Image, Row, Col, Alert, DropdownButton } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { useAuth } from "../Contexts/AuthContext";
import { fetchEventTickets, fetchIndividualEvent, updateEventTickets } from "../apiEventBriteCalls";
import SignUpModal from '../Components/SignUpModal'
import { handleFormatDate, isEventOld } from "../utils";
import ReturnToEventsButton from "../Components/ReturnToEventsButton";
import { MyEventsContext } from "../Contexts/MyEventsContext";
import { addAnEvent, getCollection, upDateEventAttendees, upDateMyEvents } from "../apiFirebaseCalls";
import SoldOutModal from "../Components/SoldOutModal";
import { IsStaffContext } from "../Contexts/IsStaffContext";
import AttendeeCard from "../Components/AttendeeCard";

export default function IndividualEvent({ organizationId, images, imagesLoading, setEventsTickets }) {
  const { myEvents } = useContext(MyEventsContext);
  const { event_id } = useParams();
  const { currentUser } = useAuth();
  const {isStaff} = useContext(IsStaffContext);
  
  // data states
  const [event, setEvent] = useState([]);
  const [dateInfo, setDateInfo] = useState({})
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSoldOutModal, setShowSoldOutModal] = useState(false);
  const [eventTickets, setEventTickets] = useState(null)
  const [alreadySignedUp, setAlreadySignedUp] = useState(false) 
  const [signUpComplete, setSignUpComplete]= useState(false)
  const [soldOut, setSoldOut]= useState(false)
  const [pastEvent, setPastEvent] = useState(false)
  const [attendees, setAttendees] =useState([])
  

  // loading states
  const [eventLoading, setEventLoading] = useState(false);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [signingUp, setSigningUp]= useState(false)
  const [attendeesLoading, setAttendeesLoading] =useState(false)
  
  // error states
  const [fetchEventError, setFetchEventError] = useState("")
  const [fetchTicketError, setFetchTicketError] = useState("")
  const [signUpError, setSignUpError] = useState("")
  const [attendeesError, setAttendeesError] =useState("")
   
  useEffect(() => {
    handleFetchIndividualEvent()
    handleFetchAttendees()
  }, []);

  useEffect(() => {
    handleSetAlreadySignedUp()
  }, [event]);
  
  function handleShowSignUpModal() {setShowSignUpModal(true);}
  function handleShowSoldOutModal() {setShowSoldOutModal(true);}

  async function handleFetchIndividualEvent() {
    setEventLoading(true)
    setFetchEventError('')
    try {
      const responseEvent = await fetchIndividualEvent(event_id, organizationId);
      setEvent(responseEvent);

      const startDateString = responseEvent.start.utc
      const endDateString = responseEvent.end.utc
      setPastEvent(isEventOld(startDateString))
      setDateInfo(handleFormatDate(startDateString, endDateString))

      const eventId = responseEvent.id
      await fetchIndividualEventTickets(eventId)
    } catch (error) {
        console.log('failed to fetch individual event', error);
        setFetchEventError('Failed to load event')
    } finally {
        setEventLoading(false)
    }
  }

  async function fetchIndividualEventTickets(eventId) {
    setTicketLoading(true)
    setFetchTicketError('')
    try {
      const responseTickets = await fetchEventTickets(eventId)
      setEventTickets(responseTickets[0])
      responseTickets[0].quantity_total <= 1 ? setSoldOut(true) : setSoldOut(false)
    } catch (error) {
      console.log('failed to fetch individual Ticket', error);
      setFetchTicketError('Failed to load Ticket')
    } finally {
        setTicketLoading(false)
    }
  }

  function handleSetAlreadySignedUp() {
    myEvents.includes(event.id) ? setAlreadySignedUp(true) : null
  }
  
  async function handleAddAttendeesToDataBase() { 
    setSignUpError('')
    try {
      const eventData = event.id
      await upDateMyEvents(currentUser.email, eventData)
      await addAnEvent(event.id)
      await upDateEventAttendees(eventData, currentUser.email)
    } catch(error) {
      console.log('error adding attendee to database', error)
      setSignUpError('Error adding you to this events data base, please contact Gather')
    } finally {
    }
  }

  async function handleFetchAttendees() { 
    setAttendeesError('')
    setAttendeesLoading(true)
    try {
      const attendeesResponse = await getCollection("events", event_id)
      console.log(attendeesResponse.signedUpUsers)
      setAttendees(attendeesResponse.signedUpUsers)
    } catch(error) {
      console.log('error fetching attendees ', error)
      setAttendeesError('Error fetching attendees')
    } finally {
      setAttendeesLoading(false)
    }
  }

  async function handleSignUp() {
    setSignUpError('')
    setSigningUp(true)
    try{
      const responseTickets = await fetchEventTickets(event.id)
      const uptoDateTickets = responseTickets[0].quantity_total

          /* eventbrite issue, cant write to tickets_sold its read only, 
          bug with with reducing tickets quantity, cant reduce to zero always needs to be at least 1 */
          
      if (uptoDateTickets > 1) {
        const updatedTicketsQuantity = responseTickets[0].quantity_total - 1
        const body = {ticket_class:{quantity_total: updatedTicketsQuantity}}
        const ticketClassId = responseTickets[0].id
        const eventId = event.id
        const updatedResponseTicket = await updateEventTickets(body, eventId, ticketClassId)
        handleAddAttendeesToDataBase()
        
        setEventsTickets((prevTickets) => ({...prevTickets, [event.id]: updatedResponseTicket})) // update tickets to show new quantity_total for this ticket
      
        handleShowSignUpModal()
        setSignUpComplete(true)
      } else if (uptoDateTickets <= 1) {
        setSoldOut(true)
        handleShowSoldOutModal()
      }
    } catch (error) {
      console.log("error checking ticket availibilty", error)
      setSignUpError('error completing signing up')
    } finally {
      setSigningUp(false)
    }
  }

  return (
    <Container >
       {fetchEventError && <Alert variant="danger">{fetchEventError}</Alert>}
       {signUpError && <Alert variant="danger">{signUpError}</Alert>}
        {eventLoading ? <p>-- Loading Event --</p> : 
          <Row > 
            <Col className= 'p-1 mt-4' >
                {imagesLoading ? <p>-- Image Loading --</p> :<Image style={{width:"92vw", maxWidth:"600px"}} className="ps-2" src={images[event?.category_id]?.small} alt={`generic ${event?.name?.text} event image`}/>}
            </Col>
            <Col >
                <h1 className= 'mt-5'> {event?.name?.text}</h1>
                <h5 >{dateInfo?.startDate}</h5>
                <p>To</p>
                <h5 >{dateInfo?.endDate}</h5>
                <p>{event?.summary}</p>

                {fetchTicketError ? 
                  <Alert variant="danger">{fetchTicketError}</Alert> :
                  ticketLoading ? <p>-- Ticket Loading --</p> :
                  pastEvent ? null :
                  soldOut ? <Alert variant="danger">TICKETS SOLD OUT</Alert> :
                  <>
                    {eventTickets?.free ? <p style={{color:"green"}}>free event</p> : eventTickets?.donation ? <p style={{color:"blue"}}>donation</p> : <p style={{color:"red"}}>Price: {eventTickets?.cost?.display}</p>}
                    <p style={{color:"green"}}>Tickets Available: {eventTickets?.quantity_total < 5 && eventTickets?.quantity_total > 0 ? 'Nearly Sold Out!!' : eventTickets?.quantity_total == 0 ? 'Sold Out!!!!!' : eventTickets?.quantity_total }</p>
                  </>
                }
                <ReturnToEventsButton string={"Return To Events"}/>
                {
                  currentUser && !alreadySignedUp && !pastEvent  ? 
                    <>
                      {!soldOut && <Button className="ms-5" onClick={handleSignUp} disabled={signUpComplete}>Sign Up</Button>}

                      {soldOut && <SoldOutModal setShowSoldOutModal={setShowSoldOutModal} showSoldOutModal={showSoldOutModal} event={event} />}

                      {signUpComplete ? 
                        <SignUpModal setShowSignUpModal={setShowSignUpModal} showSignUpModal={showSignUpModal} event={event} signUpComplete={signUpComplete}/> : 
                        signingUp &&
                          <p>signing up</p>
                      }
                    </> : 
                    !pastEvent && currentUser && <Button disabled={true}  variant="success" className="ms-2" >Already Signed Up</Button>
                }
            </Col>
          </Row>
        }
        { currentUser && isStaff &&
          <Row>
            <DropdownButton className="mt-2 mb-2" id="dropdown-item-button" title="Current Guest List">
              {attendees && attendees.map((attendee, index)=><AttendeeCard key={`${index}${event_id}`} attendee={attendee} />)}
            </DropdownButton>
          </Row>
        }
    </Container>
)}