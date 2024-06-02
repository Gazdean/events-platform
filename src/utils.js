export function formatCreateEventData(data) {
    const body = {
        event :{
            listed:false,
            ticket_classes: [{
                "name": "General Admission",
                "quantity_total": 0,
                "cost": {
                    "value": "0",
                    "currency": "GBP"
                },
                free: true
            }],
            venue: {
                "name": "",
                "address": {
                    "country": "UK"
                }
            }
        }
    }

    if (!Object.keys(data).length) return {}
    else {
        body.event.name = {html:`<p>${data.name}</p>`}
        body.event.description = {html:`<p>${data.description}</p>`}
        body.event.start = {timezone: "Europe/London", utc: `${data.start}:00Z`}
        body.event.end = {timezone: "Europe/London", utc: `${data.end}:00Z`}
        body.event.capacity = Number(data.capacity)
        body.event.category_id = data.category_id
        body.event.venue =  {
                                name: data.venueName,
                                address: {...body.event.venue.address,
                                    address_1: data.address_1,
                                    address_2: data.address_2,
                                    city: data.city,
                                    region: data.region,
                                    postal_code: data.postal_code}
                            }
        if (data.isFree === true) {
                body.event.ticket_classes = [{
                    name: "General Admission",
                    quantity_total: 0,
                    cost: {
                        "value": "0",
                        "currency": "GBP"
                    },
                    free: true
                }]
            }
    }
  return body
  
}