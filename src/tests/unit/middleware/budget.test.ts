import { createRequest, createResponse } from "node-mocks-http";
import { validateBudgetExist } from '../../../middleware/budget';
import BudgetModel from "../../../models/BudgetModel";
import { budgets } from '../../mocks/budgets';

jest.mock('../../../models/BudgetModel', () => ({
      findByPk: jest.fn()
}));

describe('budget - validateBudgetExists', () => {
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