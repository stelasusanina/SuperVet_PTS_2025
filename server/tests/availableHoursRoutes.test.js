import { getFreeHoursByVetId } from "../routes/availableHoursRoutes";
import FreeHour from "../models/FreeHour";

jest.mock("../models/FreeHour");

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

describe("Available Hours Routes", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    FreeHour.mockImplementation((id, vet_id, date_time) => {
      return { id, vet_id, date_time };
    });

    req = {
      params: {
        vetId: "1",
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

  test("should return 404 when no free hours are found", async () => {
    req.app.locals.dbConnection.query = jest.fn((query, params, callback) => {
      callback(null, []);
    });

    await getFreeHoursByVetId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No free hours found for this vet",
    });
  });

  test("should return free hours when found", async () => {
    const mockFreeHours = [
      { id: 1, vet_id: 1, date_time: "2025-05-01T10:00:00", is_free: 1 },
      { id: 2, vet_id: 1, date_time: "2025-05-01T11:00:00", is_free: 1 },
      { id: 3, vet_id: 1, date_time: "2025-05-01T14:00:00", is_free: 1 },
    ];

    req.app.locals.dbConnection.query = jest.fn((query, params, callback) => {
      callback(null, mockFreeHours);
    });

    await getFreeHoursByVetId(req, res);

    expect(res.json).toHaveBeenCalledWith([
      { id: 1, vet_id: 1, date_time: "2025-05-01T10:00:00" },
      { id: 2, vet_id: 1, date_time: "2025-05-01T11:00:00" },
      { id: 3, vet_id: 1, date_time: "2025-05-01T14:00:00" },
    ]);
    expect(FreeHour).toHaveBeenCalledTimes(3);
  });

  test("should pass correct vetId parameter to database query", async () => {
    req.params.vetId = "42";

    req.app.locals.dbConnection.query = jest.fn((query, params, callback) => {
      expect(params).toEqual(["42"]);
      callback(null, [
        { id: 5, vet_id: 42, date_time: "2025-05-02T15:00:00", is_free: 1 },
      ]);
    });

    await getFreeHoursByVetId(req, res);

    expect(req.app.locals.dbConnection.query).toHaveBeenCalled();
  });
});
