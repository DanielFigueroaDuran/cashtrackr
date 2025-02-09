import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthController } from "../../controllers/AuthController";

describe('Authentication - Create Account', () => {

      it('should display validation errors when form is empty', async () => {
            const response = await request(server)
                  .post('/api/auth/create-account')
                  .send({});
            // console.log(response.body);

            const createAccountMock = jest.spyOn(AuthController, 'createAccount');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toHaveLength(3);

            expect(response.status).not.toBe(201);
            expect(response.body.errors).not.toHaveLength(2);
            expect(createAccountMock).not.toHaveBeenCalled();
      });

      it('should return 400 when tje email is invalid', async () => {
            const response = await request(server)
                  .post('/api/auth/create-account')
                  .send({
                        "name": "Daniel",
                        "password": "12345678",
                        "email": "not_valid_email"
                  });

            const createAccountMock = jest.spyOn(AuthController, 'createAccount');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toHaveLength(1);

            expect(response.status).not.toBe(201);
            expect(response.body.errors).not.toHaveLength(2);
            expect(createAccountMock).not.toHaveBeenCalled();
      });

      it('should return 400 when tje password is invalid', async () => {
            const response = await request(server)
                  .post('/api/auth/create-account')
                  .send({
                        "name": "Daniel",
                        "password": "",
                        "email": "test@test.com"
                  });

            const createAccountMock = jest.spyOn(AuthController, 'createAccount');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toHaveLength(1);

            expect(response.status).not.toBe(201);
            expect(response.body.errors).not.toHaveLength(2);
            expect(createAccountMock).not.toHaveBeenCalled();
      });
});

