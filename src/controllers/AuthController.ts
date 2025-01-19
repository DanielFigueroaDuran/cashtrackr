import type { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../email/AuthEmail';

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
                  const user = new UserModel(req.body);
                  user.password = await hashPassword(password);
                  user.token = generateToken();
                  await user.save();

                  await AuthEmail.sendConfirmationEmail({
                        name: user.name,
                        email: user.email,
                        token: user.token
                  })

                  res.json('Cuenta Creada Correctamente');

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
            const { email } = req.body;

            const user = await UserModel.findOne({ where: { email } })

            //check that the user exists

            if (!user) {
                  const error = new Error('Usuario no Encontrado');
                  res.status(409).json({ error: error.message });
                  return
            };
            res.json(user);
      };
};