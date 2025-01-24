import type { Request, Response } from "express";
import BudgetModel from "../models/BudgetModel";
import ExpenseModel from "../models/ExpenseModel";

export class BudgetController {
      static getAll = async (req: Request, res: Response) => {
            try {
                  const budgets = await BudgetModel.findAll({
                        order: [
                              ['createdAt', 'DESC']
                        ]
                  });

                  res.json(budgets);
                  //TODO: filter by authenticated user
            } catch (error) {
                  //console.log(error);
                  res.status(500).json({ error: 'Hubo un Error' });
            };
      };

      static create = async (req: Request, res: Response) => {
            try {
                  const budget = new BudgetModel(req.body);
                  budget.userId = req.user.id;
                  await budget.save();
                  res.status(201).json('Presupuesto Creado Correctamente');
                  return;
            } catch (error) {
                  // console.log(error);
                  res.status(500).json({ error: 'Hubo un Error' });
                  return;
            }
      };

      static getById = async (req: Request, res: Response) => {
            const budget = await BudgetModel.findByPk(req.budget.id, {
                  include: [ExpenseModel]
            });
            res.json(budget);
      };

      static updateById = async (req: Request, res: Response) => {
            //write body changes
            await req.budget.update(req.body);
            res.json('Presupuesto Actualizado Correctamente');
            return;
      };

      static deleteById = async (req: Request, res: Response) => {
            await req.budget.destroy();
            res.json('Presupuesto eliminado correctamente');
            return;
      };

}