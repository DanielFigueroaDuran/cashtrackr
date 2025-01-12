import { Request, Response } from "express";

export class BudgetController {
      static getAll = async (req: Request, res: Response) => {
            console.log('desde/api/budgets');
      };

      static create = async (req: Request, res: Response) => {
            console.log('desde POST /api/budgets');
      };

      static getById = async (req: Request, res: Response) => {
            console.log('desde GetById /api/budgets/id');
      };

      static updateById = async (req: Request, res: Response) => {
            console.log('Actualizar con el metodo Put /api/budgets');
      };

      static deleteById = async (req: Request, res: Response) => {
            console.log('Eliminar con el metodo Delete /api/budgets');
      };

}