import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthController } from "../../controllers/AuthController";
import { response } from "express";
import { body } from 'express-validator';
import Response from 'express';

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

      it('should display  error if token doesnt exists', async () => {
            const response = await request(server)
                  .post('/api/auth/confirm-account').send({
                        token: "123456"
                  });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Token no válido');
            expect(response.status).not.toBe(200);
      });

      it('should display account with a valid token', async () => {
            const token = globalThis.cashtrackrComfirmationToken;

            const response = await request(server)
                  .post('/api/auth/confirm-account')
                  .send({ token });

            expect(response.status).toBe(200);
            expect(response.body).toEqual('Cuenta confirmada correctamente');
            expect(response.status).not.toBe(401);
      });

});

describe('Authentication - Login', () => {
      it('should display validation errors when the form is empty', async () => {
            const response = await request(server)
                  .post('/api/auth/login')
                  .send({});
            const loginMock = jest.spyOn(AuthController, 'login');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toHaveLength(2);

            expect(response.body.errors).not.toHaveLength(1);
            expect(loginMock).not.toHaveBeenCalled();
      });

      it('should return 400 bad request when the email is invalid', async () => {
            const response = await request(server)
                  .post('/api/auth/login')
                  .send({
                        password: "12345678",
                        email: "no_valid"
                  });

            const loginMock = jest.spyOn(AuthController, 'login');

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toHaveLength(1);
            expect(response.body.errors[0].msg).toBe('Email no válido');

            expect(response.body.errors).not.toHaveLength(2);
            expect(loginMock).not.toHaveBeenCalled();
      });

      it('should return a 400 error if the user is not found', async () => {
            const response = await request(server)
                  .post('/api/auth/login')
                  .send({
                        password: "12345678",
                        email: "user@test.com"
                  });


            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error.msg).toBe('Usuario no Encontrado');

            expect(response.status).not.toBe(200);

      });
});