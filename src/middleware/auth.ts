import type { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";

declare global {
      namespace Express {
            interface Request {
                  user?: UserModel
            }
      }
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
      const bearer = req.headers.authorization;

      if (!bearer) {
            const error = new Error('No Autorizado');
            res.status(401).json({ error: error.message });
            return;
      };

      const [, token] = bearer.split(' ');

      if (!token) {
            const error = new Error('Token no Válido');
            res.status(401).json({ error: error.message });
            return;
      };

      // res.json({
      //       token
      // });

      try {
            const decored = Jwt.verify(token, process.env.JWT_SECRET);
            // res.json(decored);
            if (typeof decored === 'object' && decored.id) {
                  req.user = await UserModel.findByPk(decored.id, {
                        attributes: ['id', 'name', 'email']
                  });

                  next();
            };

      } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Token no Válido' });
      };
};
