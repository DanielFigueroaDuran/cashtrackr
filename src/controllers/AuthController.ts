import type { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import { hashPassword } from '../utils/auth';

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
                  await user.save();
                  res.json('Cuenta Creada Correctamente');

            } catch (error) {
                  // console.log(error);
                  res.status(500).json({ error: 'Hubo un Error' });
            }

      }
};