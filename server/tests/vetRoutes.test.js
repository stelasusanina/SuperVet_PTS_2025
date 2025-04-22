import { getAllVets, getVetById } from "../routes/vetRoutes";
import Vet from "../models/Vet";
import Review from "../models/Review";

jest.mock("../models/Vet");
jest.mock("../models/Review");

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

describe("Vet Routes", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    Vet.mockImplementation(
      (id, firstName, lastName, specialization, phone_number) => {
        return { id, firstName, lastName, specialization, phone_number };
      }
    );

    Review.mockImplementation(
      (id, vet_id, user_id, rating, comment, created_at) => {
        return { id, vet_id, user_id, rating, comment, created_at };
      }
    );

    req = {
      params: {},
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

  describe("getAllVets", () => {
    test("should return 500 when database query fails", async () => {
      req.app.locals.dbConnection.query = jest.fn((query, callback) => {
        callback(new Error("Database error"), null);
      });

      await getAllVets(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });

    test("should return 404 when no vets are found", async () => {
      req.app.locals.dbConnection.query = jest.fn((query, callback) => {
        callback(null, []);
      });

      await getAllVets(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No vets found" });
    });

    test("should return vets data when found", async () => {
      const mockVets = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          specialization: "Dogs",
          phone_number: "1234567890",
          avg_rating: 4.5,
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          specialization: "Cats",
          phone_number: "0987654321",
          avg_rating: 4.2,
        },
      ];

      req.app.locals.dbConnection.query = jest.fn((query, callback) => {
        callback(null, mockVets);
      });

      await getAllVets(req, res);

      expect(res.json).toHaveBeenCalledWith(mockVets);
    });
  });

  describe("getVetById", () => {
    beforeEach(() => {
      req.params.vetId = "1";
    });

    test("should return 404 when vet is not found", async () => {
      req.app.locals.dbConnection.query = jest.fn((query, params, callback) => {
        callback(null, []);
      });

      await getVetById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Vet not found" });
    });

    test("should return vet with reviews when found", async () => {
      const mockVetData = [
        {
          vetId: 1,
          vetFirstName: "John",
          vetLastName: "Doe",
          specialization: "Dogs",
          phone_number: "1234567890",
          reviewId: 101,
          vet_id: 1,
          user_id: 201,
          rating: 5,
          comment: "Great vet!",
          created_at: "2025-04-15T10:30:00",
          userFirstName: "Bob",
          userLastName: "Brown",
        },
        {
          vetId: 1,
          vetFirstName: "John",
          vetLastName: "Doe",
          specialization: "Dogs",
          phone_number: "1234567890",
          reviewId: 102,
          vet_id: 1,
          user_id: 202,
          rating: 4,
          comment: "Good service",
          created_at: "2025-04-14T15:45:00",
          userFirstName: "Alice",
          userLastName: "Green",
        },
      ];

      req.app.locals.dbConnection.query = jest.fn((query, params, callback) => {
        callback(null, mockVetData);
      });

      await getVetById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        vet: expect.objectContaining({
          id: 1,
          firstName: "John",
          lastName: "Doe",
          specialization: "Dogs",
          phone_number: "1234567890",
        }),
        reviews: expect.arrayContaining([
          expect.objectContaining({
            id: 101,
            vet_id: 1,
            user_id: 201,
            rating: 5,
            comment: "Great vet!",
            created_at: "2025-04-15T10:30:00",
            userFirstName: "Bob",
            userLastName: "Brown",
          }),
          expect.objectContaining({
            id: 102,
            vet_id: 1,
            user_id: 202,
            rating: 4,
            comment: "Good service",
            created_at: "2025-04-14T15:45:00",
            userFirstName: "Alice",
            userLastName: "Green",
          }),
        ]),
      });
    });

    test("should handle vet with no reviews", async () => {
      const mockVetNoReviews = [
        {
          vetId: 1,
          vetFirstName: "John",
          vetLastName: "Doe",
          specialization: "Dogs",
          phone_number: "1234567890",
          reviewId: null,
          vet_id: null,
          user_id: null,
          rating: null,
          comment: null,
          created_at: null,
          userFirstName: null,
          userLastName: null,
        },
      ];

      req.app.locals.dbConnection.query = jest.fn((query, params, callback) => {
        callback(null, mockVetNoReviews);
      });

      await getVetById(req, res);

      expect(res.json).toHaveBeenCalledWith({
        vet: expect.objectContaining({
          id: 1,
          firstName: "John",
          lastName: "Doe",
          specialization: "Dogs",
          phone_number: "1234567890",
        }),
        reviews: [],
      });
    });
  });
});
