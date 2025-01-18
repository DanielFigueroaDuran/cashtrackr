import type { Request, Response } from 'express';
import UserModel from '../models/UserModel';

export class AuthController {
      static createAccount = async (req: Request, res: Response) => {
            try {
                  const user = new UserModel(req.body);
                  await user.save();
                  res.json('Cuenta Creada Correctamente');

            } catch (error) {
                  // console.log(error);
                  res.status(500).json({ error: 'Hubo un Error' });
            }

      }
};