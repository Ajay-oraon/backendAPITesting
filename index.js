const express = require("express");
const app = express();
app.use(express.json());

let travelPackages = [
  {
    packageId: 1,
    destination: "Paris",
    price: 1500,
    duration: 7,
    availableSlots: 10,
  },
  {
    packageId: 2,
    destination: "Rome",
    price: 1200,
    duration: 5,
    availableSlots: 15,
  },
  {
    packageId: 3,
    destination: "Tokyo",
    price: 2000,
    duration: 10,
    availableSlots: 8,
  },
  {
    packageId: 4,
    destination: "New York",
    price: 1700,
    duration: 7,
    availableSlots: 12,
  },
  {
    packageId: 5,
    destination: "Dubai",
    price: 1100,
    duration: 4,
    availableSlots: 20,
  },
  {
    packageId: 6,
    destination: "Sydney",
    price: 2500,
    duration: 12,
    availableSlots: 5,
  },
  {
    packageId: 7,
    destination: "Cape Town",
    price: 1800,
    duration: 8,
    availableSlots: 6,
  },
  {
    packageId: 8,
    destination: "Bangkok",
    price: 800,
    duration: 3,
    availableSlots: 25,
  },
  {
    packageId: 9,
    destination: "Barcelona",
    price: 1400,
    duration: 6,
    availableSlots: 10,
  },
  {
    packageId: 10,
    destination: "Bali",
    price: 1300,
    duration: 5,
    availableSlots: 15,
  },
  {
    packageId: 11,
    destination: "Istanbul",
    price: 1000,
    duration: 4,
    availableSlots: 18,
  },
  {
    packageId: 12,
    destination: "London",
    price: 1900,
    duration: 9,
    availableSlots: 7,
  },
  {
    packageId: 13,
    destination: "Hawaii",
    price: 2200,
    duration: 10,
    availableSlots: 8,
  },
  {
    packageId: 14,
    destination: "Moscow",
    price: 1600,
    duration: 8,
    availableSlots: 10,
  },
  {
    packageId: 15,
    destination: "Athens",
    price: 1200,
    duration: 6,
    availableSlots: 12,
  },
];

let bookings = [
  {
    bookingId: 1,
    packageId: 1,
    customerName: "Anjali Seth",
    bookingDate: "2024-12-01",
    seats: 2,
  },
  {
    bookingId: 2,
    packageId: 5,
    customerName: "Rahul",
    bookingDate: "2024-11-20",
    seats: 3,
  },
  {
    bookingId: 3,
    packageId: 8,
    customerName: "Kiran Wankhade",
    bookingDate: "2024-10-15",
    seats: 1,
  },
  {
    bookingId: 4,
    packageId: 3,
    customerName: "Robert",
    bookingDate: "2024-09-10",
    seats: 4,
  },
  {
    bookingId: 5,
    packageId: 12,
    customerName: "Aryan Khan",
    bookingDate: "2024-08-25",
    seats: 2,
  },
];
//Retrieve All Travel Packages (GET)
async function getPackages() {
  return travelPackages;
}

app.get("/packages", async (req, res) => {
  const result = await getPackages();
  res.json(result);
});

//Exercise 2: Retrieve Travel Package by Destination (GET)

const getPackageByDestination = async (destination) => {
  return travelPackages.find((obj) => obj.destination === destination);
};

app.get("/packages/:destination", async (req, res) => {
  const packageData = await getPackageByDestination(req.params.destination);
  if (!packageData) return res.status(404).send("package not found");
  res.json(packageData);
});

//Exercise 3: Add a New Booking  (POST)
const addNewBooking = async (bookingData) => {
  const newBooking = { bookingId: bookings.length + 1, ...bookingData };
  bookings.push(newBooking);
  return newBooking;
};

app.post("/bookings", async (req, res) => {
  const bookedData = req.body;
  const result = await addNewBooking(bookedData);
  res.status(201).json({ booking: result });
});

//Exercise 4: Update Available Slots for a Package(POST)
const updateSlotsOfPackage = async (id, seatsBooked) => {
  const packageData = travelPackages.find((obj) => obj.packageId === id);
  packageData.availableSlots = packageData.availableSlots - seatsBooked;
  return packageData;
};

app.post("/packages/update-seats", async (req, res) => {
  const packageId = parseInt(req.body.packageId);
  const seatsBooked = parseInt(req.body.seatsBooked);
  const result = await updateSlotsOfPackage(packageId, seatsBooked);
  if (!result) return res.status(404).json("package not found");
  res.status(201).json({ package: result });
});

//Exercise 5: Retrieve All Bookings for a Package (GET)
const bookingsForPackage = (id) => {
  const booking = [];
  bookings.forEach((obj) => {
    if (obj.packageId === id) {
      booking.push(obj);
    }
  });
  return booking;
};

app.get("/bookings/:packageId", async (req, res) => {
  const packageId = parseInt(req.params.packageId);
  const result = bookingsForPackage(packageId);
  if (!result) return res.status(404).json("booking not found");
  res.json({ bookings: result });
});

module.exports = {
  app,
  getPackages,
  travelPackages,
  getPackageByDestination,
  addNewBooking,
  updateSlotsOfPackage,
  bookingsForPackage
};
