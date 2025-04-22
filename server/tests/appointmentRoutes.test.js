import { createAppointment } from "../routes/appointmentRoutes";

jest.mock("../index.js", () => ({
  __esModule: true,
  default: {
    locals: {
      dbConnection: null,
    },
  },
}));

jest.spyOn(console, "error").mockImplementation(() => {});
jest.spyOn(console, "warn").mockImplementation(() => {});
jest.spyOn(console, "log").mockImplementation(() => {});

describe("Appointment Routes", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        user_id: 1,
        vet_id: 2,
        date_time: "2025-05-01T14:00:00",
        freeHourId: 5,
      },
      app: {
        locals: {
          dbConnection: {
            query: jest.fn(),
          },
        },
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 400 if required fields are missing", async () => {
    req.body = {
      vet_id: 2,
      date_time: "2025-05-01T14:00:00",
      freeHourId: 5,
    };

    await createAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields" });
  });

  test("should return 500 if database connection is not established", async () => {
    req.app.locals.dbConnection = null;

    await createAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Database connection is not established.",
    });
  });

  test("should create appointment and mark hour as unavailable successfully", async () => {
    req.app.locals.dbConnection.query.mockImplementationOnce(
      (query, params, callback) => {
        callback(null, { insertId: 10 });
      }
    );

    req.app.locals.dbConnection.query.mockImplementationOnce(
      (query, params, callback) => {
        callback(null);
      }
    );

    await createAppointment(req, res);

    expect(req.app.locals.dbConnection.query).toHaveBeenCalledTimes(2);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Appointment created and hour marked unavailable successfully",
      appointment: expect.any(Object),
    });
  });

  test("should handle database error when creating appointment", async () => {
    req.app.locals.dbConnection.query.mockImplementationOnce(
      (query, params, callback) => {
        callback(new Error("Database error"), null);
      }
    );

    await createAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to create appointment",
    });
  });

  test("should handle error when marking hour as unavailable", async () => {
    req.app.locals.dbConnection.query.mockImplementationOnce(
      (query, params, callback) => {
        callback(null, { insertId: 10 });
      }
    );

    req.app.locals.dbConnection.query.mockImplementationOnce(
      (query, params, callback) => {
        callback(new Error("Failed to mark hour as unavailable"));
      }
    );

    await createAppointment(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Appointment created, but failed to update hour availability",
      appointment: expect.any(Object),
    });
  });

  test("should pass correct parameters to database queries", async () => {
    req.app.locals.dbConnection.query.mockImplementationOnce(
      (query, params, callback) => {
        callback(null, { insertId: 10 });
      }
    );

    req.app.locals.dbConnection.query.mockImplementationOnce(
      (query, params, callback) => {
        callback(null);
      }
    );

    await createAppointment(req, res);

    expect(req.app.locals.dbConnection.query.mock.calls[0][1]).toEqual([
      req.body.user_id,
      req.body.vet_id,
      req.body.date_time,
    ]);

    expect(req.app.locals.dbConnection.query.mock.calls[1][1]).toEqual([
      req.body.freeHourId,
    ]);
  });
});
