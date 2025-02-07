import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import UserModel from "../../../models/UserModel";
import { hashPassword } from '../../../utils/auth';
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

            expect(UserModel.create).toHaveBeenCalledWith(req.body);
            expect(UserModel.create).toHaveBeenCalledTimes(1);
            expect(mockUser.save).toHaveBeenCalled();
            expect(mockUser.password).toBe('hashedpassword');
            expect(mockUser.token).toBe('123456');
            expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledWith({
                  name: req.body.name,
                  email: req.body.email,
                  token: '123456'
            });
            expect(AuthEmail.sendConfirmationEmail).toHaveBeenCalledTimes(1);
            expect(res.statusCode).toBe(201);
      });
});

describe('AuthController.login', () => {
      it('should return  404 if user is not found', async () => {

            (UserModel.findOne as jest.Mock).mockResolvedValue(null);

            const req = createRequest({
                  method: 'POST',
                  url: '/api/auth/login',
                  body: {
                        email: "test@test.com",
                        password: "testpassword"
                  }
            });

            const res = createResponse();

            await AuthController.login(req, res);

            const data = res._getJSONData();
            expect(res.statusCode).toBe(404);
            expect(data).toEqual({ error: 'Usuario no Encontrado' });
            // expect(UserModel.findOne).toHaveBeenCalled();
            // expect(UserModel.findOne).toHaveBeenCalledTimes(1);
      });
});