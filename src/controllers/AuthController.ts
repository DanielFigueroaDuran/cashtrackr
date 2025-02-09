import type { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../email/AuthEmail';
import { generateJWT } from '../utils/jwt';


export class AuthController {
      static createAccount = async (req: Request, res: Response) => {
            const { email, password } = req.body;

            //Prevent Duplicates

            const userExists = await UserModel.findOne({ where: { email } })
            //res.json(userExists);
            if (userExists) {
                  const error = new Error('Un usuario con ese email ya esta registrado');
                  res.status(409).json({ error: error.message });
                  return
            };
            try {
                  // const user = new UserModel(req.body);
                  const user = await UserModel.create(req.body);
                  user.password = await hashPassword(password);
                  // user.token = generateToken();
                  const token = generateToken();
                  user.token = token;

                  if (process.env.NODE_ENV !== 'production') {
                        globalThis.cashtrackrComfirmationToken = token;
                  };

                  await user.save();

                  await AuthEmail.sendConfirmationEmail({
                        name: user.name,
                        email: user.email,
                        token: user.token
                  })

                  res.status(201).json('Cuenta Creada Correctamente');

            } catch (error) {
                  // console.log(error);
                  res.status(500).json({ error: 'Hubo un Error' });
            }

      };

      static confirmAccount = async (req: Request, res: Response) => {
            // console.log(req.body.token);
            const { token } = req.body;

            const user = await UserModel.findOne({ where: { token } });
            if (!user) {
                  const error = new Error('Token no válido');
                  res.status(401).json({ error: error.message });
                  return;
            };
            user.confirmed = true;
            user.token = null;
            await user.save();

            res.json('Cuenta confirmada correctamente');
      };

      static login = async (req: Request, res: Response) => {
            // res.json(req.body)
            const { email, password } = req.body;

            const user = await UserModel.findOne({ where: { email } })

            //check that the user exists

            if (!user) {
                  const error = new Error('Usuario no Encontrado');
                  res.status(404).json({ error: error.message });
                  return
            };

            //check if I confirm your account

            if (!user.confirmed) {
                  const error = new Error('La cuenta no ha sido confirmada');
                  res.status(403).json({ error: error.message });
                  return
            };

            //check if the password is correct

            const isPasswordCorrect = await checkPassword(password, user.password);

            if (!isPasswordCorrect) {
                  const error = new Error('password Incorrecto');
                  res.status(401).json({ error: error.message });
                  return
            };

            //generate jwt

            const token = generateJWT(user.id);

            res.json(token);
      };

      static forgotPassword = async (req: Request, res: Response) => {
            const { email } = req.body;

            const user = await UserModel.findOne({ where: { email } });

            //check that the user exists

            if (!user) {
                  const error = new Error('usuario no encontrado');
                  res.status(404).json({ error: error.message });
                  return
            };
            user.token = generateToken();
            await user.save();

            await AuthEmail.sendPasswordResetToken({
                  name: user.name,
                  email: user.email,
                  token: user.token
            });

            res.json('Revisa tu email para instruciones');
      };

      static validateToken = async (req: Request, res: Response) => {
            const { token } = req.body;

            const tokenExits = await UserModel.findOne({ where: { token } });
            if (!tokenExits) {
                  const error = new Error('Token no valido');
                  res.status(404).json({ error: error.message });
                  return;
            };

            res.json('Token válido...');
      };

      static resetPasswordWithToken = async (req: Request, res: Response) => {
            const { token } = req.params;
            const { password } = req.body;

            const user = await UserModel.findOne({ where: { token } });
            if (!user) {
                  const error = new Error('Token no valido');
                  res.status(404).json({ error: error.message });
                  return;
            };

            // assign a new password

            user.password = await hashPassword(password);
            user.token = null;
            await user.save();

            res.json('El password se modifió correctamente');
      };

      static user = async (req: Request, res: Response) => {
            // res.json(req.headers.authorization);
            res.json(req.user);
      };

      static updateCurrentUserPassword = async (req: Request, res: Response) => {
            const { current_password, password } = req.body;
            const { id } = req.user;

            const user = await UserModel.findByPk(id);

            const isPasswordCorrect = await checkPassword(current_password, user.password);

            if (!isPasswordCorrect) {
                  const error = new Error('El password actual es incorrecto');
                  res.status(401).json({ error: error.message });
                  return;
            };

            user.password = await hashPassword(password);
            await user.save();

            res.json('El password se modificó correctamente');

      };

      static checkPassword = async (req: Request, res: Response) => {
            const { password } = req.body;
            const { id } = req.user;

            const user = await UserModel.findByPk(id);

            const isPasswordCorrect = await checkPassword(password, user.password);

            if (!isPasswordCorrect) {
                  const error = new Error('El password actual es incorrecto');
                  res.status(401).json({ error: error.message });
                  return;
            };


            res.json('Passwor Correcto');

      };
};