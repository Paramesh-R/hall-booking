var express = require('express');
var router = express.Router();




let rooms = []
let bookingDetails = []
let customerDetails = []

// 1.Create Room
router.post("/createroom", (req, res) => {
  if (req.body.roomId && req.body.amenities && req.body.no_of_seats && req.body.price_per_hour) {
    if (rooms.filter((room) => (room.roomId === req.body.roomId)).length) {
      res.send(`<h1>Room with id ${req.body.roomId} already exist</h1>`)
    } else {
      rooms.push(
        {
          "roomId": req.body.roomId,
          "amenities": req.body.amenities,
          "no_of_seats": req.body.no_of_seats,
          "price_per_hour": req.body.price_per_hour
        }
      )

      res.send(`<h1>Room Created</h1>`)
    }
  } else {
    res.send(`<h1>Fill all details</h1>`)
  }
})


//2.book room and add customer name
router.post("/bookroom", (req, res) => {

  if (rooms.filter((room) => (room.roomId === req.body.roomId)).length === 0) {

    res.send(`Room ${req.body.roomId}does not exist`)
  } else if (
    req.body.customerName &&
    req.body.roomId &&
    req.body.date &&
    req.body.startTime &&
    req.body.endTime
  ) {


    // Filter Existing booking with requested Date and room Id
    filter_booking = bookingDetails.filter((booking) => {
      return (booking.date == req.body.date && booking.roomId === req.body.roomId)
    })



    if (filter_booking.length) {
      res.send(`Room ${req.body.roomId} already booked for ${req.body.date}`)
    } else {
      if (!customerDetails.includes(req.body.customerName)) {
        customerDetails.push(req.body.customerName)
      }
      bookingDetails.push({
        "bookingId": bookingDetails.length + 1,
        "customerName": req.body.customerName,
        "roomId": req.body.roomId,
        "date": req.body.date,
        "startTime": req.body.startTime,
        "endTime": req.body.endTime
      })
      res.send("Room Booking Done")


    }



  } else {
    res.send("Missing Details - Unable to Book Room")
  }
})

//3. show rooms
router.get("/showrooms", (req, res) => {
  let showRooms = []
  rooms.forEach((room) => {
    filteredBooking = bookingDetails.filter((element) => { return element.roomId === room.roomId })
    showRooms.push({
      "Room Name": room.roomId,
      "Booked Status": filteredBooking.length,
      "Bookings": (filteredBooking)
    })
  })

  res.send(showRooms)

})


//4. show customers
router.get("/showcustomers", (req, res) => {
  customer_bookings = []
  customerDetails.forEach((cust) => {

    bookedRoomDetails = []
    filteredBooking = bookingDetails.filter((element) => (element.customerName === cust))
    filteredBooking.forEach((booking) => {
      bookedRoomDetails.push({
        "RoomID": booking.roomId,
        "Date": booking.date,
        "Start": booking.startTime,
        "End": booking.endTime
      })
    })
    customer_bookings.push({
      'Customer name': cust,
      "Bookings": bookedRoomDetails
    })
  })
  res.status(200).send(customer_bookings)
})



/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(`
  <h1>Hall Booking</h1>
  <h3> POST: /createroom</h3 >
  <h3>GET: /showrooms</h3>
  <h3>POST: /bookroom</h3>
  <h3>GET: /showcustomers</h3>
  `);
});

module.exports = router;
