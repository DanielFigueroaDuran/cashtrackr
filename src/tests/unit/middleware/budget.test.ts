import { createRequest, createResponse } from "node-mocks-http";
import { hasAccess, validateBudgetExist } from '../../../middleware/budget';
import BudgetModel from "../../../models/BudgetModel";
import { budgets } from '../../mocks/budgets';

jest.mock('../../../models/BudgetModel', () => ({
      findByPk: jest.fn()
}));

describe('Budget Middleware - validateBudgetExists', () => {
      it('should handle not-existent budget', async () => {
            (BudgetModel.findByPk as jest.Mock).mockResolvedValue(null);

            const req = createRequest({
                  params: {
                        budgetId: 1
                  }
            });
            const res = createResponse();
            const next = jest.fn();

            await validateBudgetExist(req, res, next);

            const data = res._getJSONData();
            expect(res.statusCode).toBe(404);
            expect(data).toEqual({ error: 'Presupuesto no encontrado' });
            expect(next).not.toHaveBeenCalled();
      });

      it('should handle not-existent budget', async () => {
            (BudgetModel.findByPk as jest.Mock).mockRejectedValue(new Error);

            const req = createRequest({
                  params: {
                        budgetId: 1
                  }
            });
            const res = createResponse();
            const next = jest.fn();

            await validateBudgetExist(req, res, next);

            const data = res._getJSONData();
            expect(res.statusCode).toBe(500);
            expect(data).toEqual({ error: 'Hubo un Error' });
            expect(next).not.toHaveBeenCalled();
      });

      it('should to next middleware if budget exists', async () => {
            (BudgetModel.findByPk as jest.Mock).mockResolvedValue(budgets[0]);

            const req = createRequest({
                  params: {
                        budgetId: 1
                  }

            });

            const res = createResponse();
            const next = jest.fn();

            await validateBudgetExist(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(req.budget).toEqual(budgets[0]);
      });
});

describe('Budget Middleware - hasAccess', () => {
      it('should call next() if user has access to budget', () => {
            const req = createRequest({
                  budget: budgets[0],
                  user: { id: 1 }
            });
            const res = createResponse();
            const next = jest.fn();

            // console.log('cls1', req.budget.id);
            // console.log('clg2', req.budget.userId);

            hasAccess(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
      });

      it('should return 401 error if userId does not have access to budget', () => {
            const req = createRequest({
                  budget: budgets[0],
                  user: { id: 1 }
            });
            const res = createResponse();
            const next = jest.fn();


            hasAccess(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).toHaveBeenCalledTimes(1);
      });
});