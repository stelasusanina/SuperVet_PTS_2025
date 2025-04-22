import { handleAddReview } from '../routes/reviewRoutes'; 

jest.mock('../index.js', () => ({
  __esModule: true,
  default: {
    locals: {
      dbConnection: null
    }
  }
}));

jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Review Routes', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        vet_id: 1,
        userFirstName: 'John',
        userLastName: 'Doe',
        rating: 5,
        comment: 'Great service!'
      },
      app: {
        locals: {
          dbConnection: {
            query: jest.fn()
          }
        }
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 if required fields are missing', async () => {
    req.body = {
      userFirstName: 'John',
      rating: 5,
      comment: 'Missing vet_id and last name'
    };

    await handleAddReview(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields.' });
  });

  test('should return 404 if user is not found', async () => {
    req.app.locals.dbConnection.query.mockImplementationOnce((query, params, callback) => {
      callback(null, []);
    });

    await handleAddReview(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
  });

  test('should return 500 if adding review fails', async () => {
    req.app.locals.dbConnection.query
      .mockImplementationOnce((query, params, callback) => {
        callback(null, [{ id: 42 }]);
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(new Error('Insert error'));
      });

    await handleAddReview(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to add review.' });
  });

  test('should return 201 on successful review addition', async () => {
    req.app.locals.dbConnection.query
      .mockImplementationOnce((query, params, callback) => {
        callback(null, [{ id: 42 }]);
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(null);
      });

    await handleAddReview(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Review added successfully.' });
  });
});
