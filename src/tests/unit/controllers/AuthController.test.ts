import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import UserModel from "../../../models/UserModel";
import { hashPassword } from "../../../utils/auth";
import { generateToken } from "../../../utils/token";
import { AuthEmail } from "../../../email/AuthEmail";

jest.mock('../../../models/UserModel');
jest.mock('../../../utils/auth');
jest.mock('../../../utils/token');

describe('AuthController.createAccount', () => {

      beforeEach(() => { // reset all mocks before running
            jest.resetAllMocks()
      })

      it('should return a 409 status an error message if the email is already registered', async () => {

            (UserModel.findOne as jest.Mock).mockResolvedValue(true);

            const req = createRequest({
                  method: 'POST',
                  url: '/api/auth/create-account',
                  body: {
                        email: "test@test.com",
                        password: "testpassword"
                  }
            });

            const res = createResponse();

            await AuthController.createAccount(req, res);

            const data = res._getJSONData();
            expect(res.statusCode).toBe(409);
            expect(data).toHaveProperty('error', 'Un usuario con ese email ya esta registrado');
            expect(UserModel.findOne).toHaveBeenCalled();
            expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      });

      it('should register a new user and return a success message', async () => {
            const req = createRequest({
                  method: 'POST',
                  url: '/api/auth/create-account',
                  body: {
                        email: "test@test.com",
                        password: "testpassword",
                        name: "test Name"
                  }
            });

            const res = createResponse();

            const mockUser = { ...req.body, save: jest.fn() };

            (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
            (hashPassword as jest.Mock).mockResolvedValue('hashedpassword');
            (generateToken as jest.Mock).mockReturnValue('123456');
            jest.spyOn(AuthEmail, "sendConfirmationEmail").mockImplementation(() => Promise.resolve());

            await AuthController.createAccount(req, res);

            expect(res.statusCode).toBe(201);
      });
});