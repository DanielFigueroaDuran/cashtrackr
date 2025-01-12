import { Request, Response } from "express";

export class BudgetController {
      static getAll = async (req: Request, res: Response) => {
            console.log('desde/api/budgets');
      };

      static create = async (req: Request, res: Response) => {
            console.log('desde POST /api/budgets');
      }
}