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

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
      await param('expenseId')
            .isInt()
            .custom(value => value > 0)
            .withMessage('Id no Válido')
            .run(req)

      let errors = validationResult(req);
      if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
            return;
      };

      next();
};