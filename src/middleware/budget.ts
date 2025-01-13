import { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator';
import BudgetModel from '../models/BudgetModel';
import express from 'express';

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