import { Request, Response } from "express";
import BudgetModel from "../models/BudgetModel";

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
            try {
                  const { id } = req.params;
                  const budget = await BudgetModel.findByPk(id);

                  if (!budget) {
                        const error = new Error('Presupuesto no encontrado');
                        res.status(404).json({ error: error.message });
                        return;
                  };
                  res.json(budget);
                  return;

            } catch (error) {
                  // console.log(error);
                  res.status(500).json({ error: 'Hubo un Error' });
                  return;
            };
      };

      static updateById = async (req: Request, res: Response) => {
            console.log('Actualizar con el metodo Put /api/budgets');
      };

      static deleteById = async (req: Request, res: Response) => {
            console.log('Eliminar con el metodo Delete /api/budgets');
      };

}