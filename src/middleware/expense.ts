import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import ExpenseModel from '../models/ExpenseModel';

declare global {
      namespace Express {
            interface Request {
                  expense?: ExpenseModel
            }
      }
};

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

export const validateExpenseExist = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const { expenseId } = req.params;
            const expense = await ExpenseModel.findByPk(expenseId);

            if (!expense) {
                  const error = new Error('Gasto no encontrado');
                  res.status(404).json({ error: error.message });
                  return;
            };

            req.expense = expense;

            next();

      } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Hubo un Error' });
            return;
      };

};

export const belongsToBudget = async (req: Request, res: Response, next: NextFunction) => {
      console.log(req.budget);
      console.log(req.expense);
      if (req.budget.id !== req.expense.budgetId) {
            const error = new Error('Acción no válida');
            res.status(403).json({ error: error.message });
            return;
      };
      next();
};