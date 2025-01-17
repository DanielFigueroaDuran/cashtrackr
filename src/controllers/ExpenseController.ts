import type { Request, Response } from 'express'
import ExpenseModel from '../models/ExpenseModel';

export class ExpensesController {
      static getAll = async (req: Request, res: Response) => {

      };

      static create = async (req: Request, res: Response) => {
            // console.log(req.params.budgetId);
            // console.log(req.budget.id);
            try {
                  const expense = new ExpenseModel(req.body);
                  expense.budgetId = req.budget.id;
                  await expense.save();
                  res.status(201).json('Gasto agregado correctamente');
            } catch (error) {
                  // console.log(error);
                  res.status(500).json({ error: 'Hubo un error' });
            }
      };

      static getById = async (req: Request, res: Response) => {

      }

      static updateById = async (req: Request, res: Response) => {

      }

      static deleteById = async (req: Request, res: Response) => {

      }
}