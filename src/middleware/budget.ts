import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import BudgetModel from '../models/BudgetModel';

declare global {
      namespace Express {
            interface Request {
                  budget?: BudgetModel
            }
      }
};

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
      await param('budgetId')
            .isInt()
            .withMessage('ID no válido')
            .custom(value => value > 0).withMessage('ID no válido')
            .run(req);

      let errors = validationResult(req);
      if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
            return;
      };

      next();
};

export const validateBudgetExist = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const { budgetId } = req.params;
            const budget = await BudgetModel.findByPk(budgetId);

            if (!budget) {
                  const error = new Error('Presupuesto no encontrado');
                  res.status(404).json({ error: error.message });
                  return;
            };

            req.budget = budget;

            next();

      } catch (error) {
            // console.log(error);
            res.status(500).json({ error: 'Hubo un Error' });
            return;
      };


};

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {
      await body('name')
            .notEmpty().withMessage('El nombre del presupuesto no puede ir vacio').run(req);
      await body('amount')
            .notEmpty().withMessage('La cantidad del presupuesto no puede ir vacia')
            .isNumeric().withMessage('Cantidad no valida')
            .custom(value => value > 0).withMessage('EL presupuesto debe ser mayor de 0').run(req);

      next();
};