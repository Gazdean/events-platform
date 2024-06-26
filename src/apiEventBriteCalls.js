import axios from "axios";

const eventbriteToken = import.meta.env.VITE_EVENTBRITE_PERSONAL_OAUTH_TOKEN;
const baseUrl = "https://www.eventbriteapi.com/v3/";
const headers = {
  Authorization: `Bearer ${eventbriteToken}`,
  "Content-Type": "application/json",
};

async function fetchEventbriteCategories() {

  const url = `${baseUrl}categories/`;

  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

async function createEventbriteEvent(eventData, organizationId) {

  const url = `${baseUrl}organizations/${organizationId}/events/`;

  try {
    const response = await axios.post(url, eventData, { headers: headers });
    return response.data;
  } catch (error) {
    console.error("Error while creating event:", error);
    throw error;
  }
}

async function createEventTicketClass(ticketData, event_id) {

  const url = `${baseUrl}events/${event_id}/ticket_classes/`;

  try {
    const response = await axios.post(url, ticketData, { headers: headers });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function fetchAllEvents(organizationId) {

  const url = `${baseUrl}organizations/${organizationId}/events/`;
  const params = { expand: "ticket_availability" };
  try {
    const response = await axios.get(url, { headers: headers, params: params });
    return response.data.events;
  } catch (error) {
    console.error("Error fetching events:",error);
    throw error
  }
}

async function fetchIndividualEvent(eventId) {

  const url = `${baseUrl}/events/${eventId}/`;

  try {
    const response = await axios.get(url, { headers: headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

async function fetchEventTickets(eventId) {

  const url = `${baseUrl}events/${eventId}/ticket_classes/`;

  try {
    const response = await axios.get(url, { headers });
    return response.data.ticket_classes;
  } catch (error) {
    console.error("Error fetching ticket classes:", error);
    throw error;
  }
}

async function getEventbriteOrganizationId() {

  const url = `${baseUrl}users/me/organizations/`;

  try {
    const response = await axios.get(url, { headers });
    return response.data.organizations[0].id;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function updateEventTickets(data, eventId, ticket_class_id) {

  const url = `${baseUrl}events/${eventId}/ticket_classes/${ticket_class_id}/`;
  // update TicketClasses is a post on eventbrite not a patch?
  try {
    const response = await axios.post(url, data, { headers });
    console.log("response data in update call",response.data)
    return response.data
  } catch (error) {
    console.error("Error updating ticket classes:", error);
    throw error;
  }
}

export {
  fetchEventbriteCategories,
  createEventbriteEvent,
  getEventbriteOrganizationId,
  createEventTicketClass,
  fetchAllEvents,
  fetchEventTickets,
  fetchIndividualEvent,
  updateEventTickets
};
