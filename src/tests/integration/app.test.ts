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

      it('should register a new user successfully ', async () => {

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

      it('should return 409 conflict when a user is already registered ', async () => {

            const userData = {
                  "name": "Daniel",
                  "password": "12345678",
                  "email": "test@test.com"
            };

            const response = await request(server)
                  .post('/api/auth/create-account')
                  .send(userData);

            //console.log(response.body);

            expect(response.status).toBe(409);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Un usuario con ese email ya esta registrado');
            expect(response.status).not.toBe(400);
            expect(response.status).not.toBe(201);
            expect(response.body).not.toHaveProperty('errors');
      });
});

describe('Authentication - Account Confirmation with Token or not vadid', () => {
      it('should display error if token is empty', async () => {
            const response = await request(server)
                  .post('/api/auth/confirm-account').send({
                        token: "not_valid"
                  });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toHaveLength(1);
            expect(response.body.errors[0].msg).toBe('Token no válido')
      });
});

