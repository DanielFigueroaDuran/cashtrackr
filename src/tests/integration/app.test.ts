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

      it('should return 400 status code when the email is invalid', async () => {
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

            expect(response.body.errors[0].msg).toBe('E-mail no válido');

            expect(response.status).not.toBe(201);
            expect(response.body.errors).not.toHaveLength(2);
            expect(createAccountMock).not.toHaveBeenCalled();
      });

      it('should return 400 status code when the password is less then 8 characters', async () => {
            const response = await request(server)
                  .post('/api/auth/create-account')
                  .send({
                        "name": "Daniel",
                        "password": "short",
                        "email": "test@test.com"
                  });

            const createAccountMock = jest.spyOn(AuthController, 'createAccount');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toHaveLength(1);

            expect(response.body.errors[0].msg).toBe('El password es muy corto, mínimo 8 caracteres');

            expect(response.status).not.toBe(201);
            expect(response.body.errors).not.toHaveLength(2);
            expect(createAccountMock).not.toHaveBeenCalled();
      });

      it('should return 201 status code ', async () => {

            const userData = {
                  "name": "Daniel",
                  "password": "12345678",
                  "email": "test@test.com"
            };

            const response = await request(server)
                  .post('/api/auth/create-account')
                  .send(userData);

            expect(response.status).toBe(201);
            expect(response.status).not.toBe(400);
            expect(response.body).not.toHaveProperty('errors');
      });
});

