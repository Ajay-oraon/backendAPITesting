let {
  app,
  getPackages,
  travelPackages,
  getPackageByDestination,
  addNewBooking,
  updateSlotsOfPackage,
  bookingsForPackage,
} = require("../index");
let http = require("http");
let request = require("supertest");

jest.mock("../index.js", () => ({
  ...jest.requireActual("../index.js"),
  getPackages: jest.fn(),
  getPackageByDestination: jest.fn(),
  addNewBooking: jest.fn(),
  updateSlotsOfPackage: jest.fn(),
  bookingsForPackage: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API Endpoints test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all Packages", async () => {
    const mockTravelPackages = travelPackages;
    getPackages.mockResolvedValue(mockTravelPackages);

    let result = await request(server).get("/packages");
    expect(result.body).toEqual(mockTravelPackages);
    expect(result.statusCode).toBe(200);
  });

  it("should retrieve package by Destination", async () => {
    const mockPackage = {
      packageId: 1,
      destination: "Paris",
      price: 1500,
      duration: 7,
      availableSlots: 10,
    };

    getPackageByDestination.mockResolvedValue(mockPackage);

    const result = await request(server).get("/packages/Paris");
    expect(result.body).toEqual(mockPackage);
  });

  it("should add new booking", async () => {
    const newBooking = {
      packageId: 4,
      customerName: "Raj Kulkarni",
      bookingDate: "2024-12-20",
      seats: 2,
    };

    addNewBooking.mockResolvedValue({ bookingId: 6, ...newBooking });

    const result = await request(server).post("/bookings").send(newBooking);
    expect(result.body.booking).toEqual({ bookingId: 6, ...newBooking });
    expect(result.statusCode).toBe(201);
  });

  it("should update available slots", async () => {
    const reqBody = {
      packageId: 1,
      seatsBooked: 2,
    };
    const mockPackage = {
      packageId: 1,
      destination: "Paris",
      price: 1500,
      duration: 7,
      availableSlots: 8,
    };

    updateSlotsOfPackage.mockResolvedValue(mockPackage);

    const result = await request(server)
      .post("/packages/update-seats")
      .send(reqBody);
    expect(result.body.package).toEqual(mockPackage);
    expect(result.statusCode).toBe(201);
  });

  it("should retrieve booking by packageId", async () => {
    const mockBooking = [
      {
        bookingId: 1,
        packageId: 1,
        customerName: "Anjali Seth",
        bookingDate: "2024-12-01",
        seats: 2,
      },
    ];

    bookingsForPackage.mockResolvedValue(mockBooking);

    const result = await request(server).get("/bookings/1");

    expect(result.body.bookings).toEqual(mockBooking);
    expect(result.statusCode).toBe(200);
  });
});
