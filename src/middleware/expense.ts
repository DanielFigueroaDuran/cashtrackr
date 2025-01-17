import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
      await body('name')
            .notEmpty().withMessage('El nombre del gasto no puede ir vacio').run(req);
      await body('amount')
            .notEmpty().withMessage('La cantidad del gasto no puede ir vacia')
            .isNumeric().withMessage('Cantidad no valida')
            .custom(value => value > 0).withMessage('EL gasto debe ser mayor de 0').run(req);

      next();
};