import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from "../../../controllers/AuthController";
import UserModel from "../../../models/UserModel";

jest.mock('../../../models/UserModel');

describe('AuthController.createAccount', () => {
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
});