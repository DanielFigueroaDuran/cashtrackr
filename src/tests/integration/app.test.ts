import request from "supertest";
import server, { connectDB } from "../../server";
import { AuthController } from "../../controllers/AuthController";
import { response } from "express";
import UserModel from "../../models/UserModel";
import * as authUtils from "../../utils/auth";
import { hasAccess } from "../../middleware/budget";
import * as jwtUtils from "../../utils/jwt";

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
                  name: "Daniel",
                  password: "12345678",
                  email: "test@test.com"
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

      beforeEach(() => {
            jest.clearAllMocks(); //clears the previous mocks and the counter starts again
      });

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
                        "password": "12345678",
                        "email": "no_valid"
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
                        "password": "12345678",
                        "email": "user_not_found@test.com"
                  });


            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('Usuario no Encontrado');

            expect(response.status).not.toBe(200);

      });

      it('should return a 403 error if the user account is not confirmed', async () => {

            (jest.spyOn(UserModel, 'findOne') as jest.Mock).mockResolvedValue({
                  id: 1,
                  confirmed: false,
                  password: "hashedPassword",
                  email: "user_not_confirmed@test.com"
            });

            const response = await request(server)
                  .post('/api/auth/login')
                  .send({
                        "password": "12345678",
                        "email": "user_not_confirmed@test.com"
                  });


            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('La cuenta no ha sido confirmada');

            expect(response.status).not.toBe(200);
            expect(response.status).not.toBe(404);

      });

      it('should return a 403 error if the user account is not confirmed', async () => {

            const userData = {
                  name: "Test",
                  password: "12345678",
                  email: "user_not_confirmed@test.com"
            };

            await request(server)
                  .post('/api/auth/create-account')
                  .send(userData);

            const response = await request(server)
                  .post('/api/auth/login')
                  .send({
                        "password": userData.password,
                        "email": userData.email
                  });


            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('La cuenta no ha sido confirmada');

            expect(response.status).not.toBe(200);
            expect(response.status).not.toBe(404);

      });

      it('should return a 401 error if the password is incorrect', async () => {

            const findOne = (jest.spyOn(UserModel, 'findOne') as jest.Mock).mockResolvedValue({
                  id: 1,
                  confirmed: true,
                  password: "hashedPassword"
            });

            const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(false);

            const response = await request(server)
                  .post('/api/auth/login')
                  .send({
                        "password": "wrongPassword",
                        "email": "test@test.com"
                  });


            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('password Incorrecto');

            expect(response.status).not.toBe(200);
            expect(response.status).not.toBe(404);
            expect(response.status).not.toBe(404);

            expect(findOne).toHaveBeenCalledTimes(1);
            expect(checkPassword).toHaveBeenCalledTimes(1);
      });

      it('should return a jwt', async () => {

            const findOne = (jest.spyOn(UserModel, 'findOne') as jest.Mock).mockResolvedValue({
                  id: 1,
                  confirmed: true,
                  password: "hashedPassword"
            });

            const checkPassword = jest.spyOn(authUtils, 'checkPassword').mockResolvedValue(true);
            const generateJWT = jest.spyOn(jwtUtils, 'generateJWT').mockReturnValue('jwt_token');

            const response = await request(server)
                  .post('/api/auth/login')
                  .send({
                        "password": "correctPassword",
                        "email": "test@test.com"
                  });

            expect(response.status).toBe(200);
            expect(response.body).toEqual('jwt_token');

            expect(findOne).toHaveBeenCalled();
            expect(findOne).toHaveBeenCalledTimes(1);

            expect(checkPassword).toHaveBeenCalled();
            expect(checkPassword).toHaveBeenCalledTimes(1);
            expect(checkPassword).toHaveBeenCalledWith('correctPassword', 'hashedPassword');

            expect(generateJWT).toHaveBeenCalled();
            expect(generateJWT).toHaveBeenCalledTimes(1);
            expect(generateJWT).toHaveBeenCalledWith(1);

      });
});

let jwt: string;

const authenyicateUser = async () => {
      const response = await request(server)
            .post('/api/auth/login')
            .send({
                  email: "test@test.com",
                  password: "12345678"
            });

      jwt = response.body;
      expect(response.status).toBe(200);
};

describe('GET /api/budgets', () => {


      beforeAll(() => {
            jest.restoreAllMocks() // restore jest.spy functions to your implementation
      });

      beforeAll(async () => {
            await authenyicateUser();
      });

      it('shuold reject unauthenticated to budgets without a jwt', async () => {
            const response = await request(server)
                  .get('/api/budgets');

            expect(response.statusCode).toBe(401);
            expect(response.body.error).toBe('No Autorizado');
      });

      it('shuold reject unauthenticatd access to budgets without a valid jwt', async () => {
            const response = await request(server)
                  .get('/api/budgets')
                  .auth('no_valid', { type: 'bearer' });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe('Token no Válido');
      });

      it('shuold allow authenticatd access to budgets with a valid jwt', async () => {
            const response = await request(server)
                  .get('/api/budgets')
                  .auth(jwt, { type: 'bearer' });

            expect(response.body).toHaveLength(0);
            expect(response.status).not.toBe(401);
            expect(response.body.error).not.toBe('No Autorizado');
      });
});

describe('POST /api/budgets', () => {

      beforeAll(async () => {
            await authenyicateUser();
      });

      it('shuold reject unauthenticated post request to budgets without a jwt', async () => {
            const response = await request(server)
                  .post('/api/budgets');

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('No Autorizado');
      });

      it('shuold display validation when the form is submited with invalid data', async () => {
            const response = await request(server)
                  .post('/api/budgets')
                  .auth(jwt, { type: 'bearer' })
                  .send({

                  });

            expect(response.status).toBe(400);
            expect(response.body.errors).toHaveLength(4);
      });
});

describe('GET /api/budgets/:id', () => {
      beforeAll(async () => {
            await authenyicateUser();
      });

      it('shuold reject unauthenticated get to request to budget id without a jwt', async () => {
            const response = await request(server)
                  .post('/api/budgets/1');

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('No Autorizado');
      });


      //       it('shuold return 400 bad request when id is not valid', async () => {
      //             const response = await request(server)
      //                   .post('/api/budgets/not_valid')
      //                   .auth(jwt, { type: 'bearer' });

      //             expect(response.status).toBe(400);
      //             expect(response.body.errors).toBeTruthy();
      //             expect(response.body.errors).toHaveLength(1);
      //             expect(response.body.errors[0].msg).toBe('ID no válido');
      //             expect(response.status).not.toBe(401);
      //             expect(response.body.error).not.toBe('No Autorizado');
      //       });

      it('shuold return 404 not found when a budget doesnt exists', async () => {
            const response = await request(server)
                  .post('/api/budgets/3000')
                  .auth(jwt, { type: 'bearer' });

            expect(response.status).toBe(404);
            expect(response.body.error).not.toBe('Presupuesto no encontrado');
            expect(response.status).not.toBe(400);
            expect(response.status).not.toBe(401);
      });

      it('shuold return a single budget by id', async () => {
            const response = await request(server)
                  .post('/api/budgets/1')
                  .auth(jwt, { type: 'bearer' });

            expect(response.status).toBe(200);
            expect(response.status).not.toBe(400);
            expect(response.status).not.toBe(401);
            expect(response.status).not.toBe(404);
      });
});

describe('PUT /api/budgets/:id', () => {
      beforeAll(async () => {
            await authenyicateUser();
      });

      it('shuold reject unauthenticated get to request to budget id without a jwt', async () => {
            const response = await request(server)
                  .put('/api/budgets/1');

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('No Autorizado');
      });

      it('shuold display validation errors if the is empty', async () => {
            const response = await request(server)
                  .put('/api/budgets/1')
                  .auth(jwt, { type: 'bearer' })
                  .send({});

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeTruthy();
            expect(response.body.errors).toHaveLength(4);
      });

      it('shuold update a budget by id and return a success message', async () => {
            const response = await request(server)
                  .put('/api/budgets/1')
                  .auth(jwt, { type: 'bearer' })
                  .send({
                        name: "Updated Budget",
                        amount: 300
                  });

            expect(response.status).toBe(200);
            expect(response.body).toBe('Presupuesto Actualizado Correctamente')

      });
});

describe('DELETE /api/budgets/:id', () => {
      beforeAll(async () => {
            await authenyicateUser();
      });

      it('shuold reject unauthenticated get to request to budget id without a jwt', async () => {
            const response = await request(server)
                  .delete('/api/budgets/1');

            expect(response.status).toBe(401);
            expect(response.body.error).toBe('No Autorizado');
      });

      it('shuold return 404 not found when a budget doesnt exixts', async () => {
            const response = await request(server)
                  .delete('/api/budgets/3000')
                  .auth(jwt, { type: 'bearer' })

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Presupuesto no encontrado')
      });

      it('shuold delete a budget and return a success message', async () => {
            const response = await request(server)
                  .put('/api/budgets/1')
                  .auth(jwt, { type: 'bearer' })

            expect(response.status).toBe(200);
            expect(response.body).toBe('Presupuesto eliminado correctamente')

      });
});