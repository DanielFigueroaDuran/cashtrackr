import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../mocks/budgets";
import { BudgetController } from "../../controllers/BudgetController";
import BudgetModel from "../../models/BudgetModel";

jest.mock('../../models/BudgetModel', () => ({
      findAll: jest.fn()
}));

describe('BudgetController.getAll', () => {
      it('should retrieve 2 budget for user with ID 1', async () => {
            const req = createRequest({
                  method: 'GET',
                  url: 'api/budget',
                  user: { id: 1 }
            });
            const res = createResponse();

            const updateBudgets = budgets.filter(budget => budget.userId === req.user.id);

            (BudgetModel.findAll as jest.Mock).mockResolvedValue(updateBudgets);
            await BudgetController.getAll(req, res);

            const data = res._getJSONData();
            // console.log(data);

            expect(data).toHaveLength(2);
            expect(res.statusCode).toBe(200);
            expect(res.status).not.toBe(404);
      });

      it('should retrieve 1 budget for user with ID 2', async () => {
            const req = createRequest({
                  method: 'GET',
                  url: 'api/budget',
                  user: { id: 2 }
            });
            const res = createResponse();

            const updateBudgets = budgets.filter(budget => budget.userId === req.user.id);

            (BudgetModel.findAll as jest.Mock).mockResolvedValue(updateBudgets);
            await BudgetController.getAll(req, res);

            const data = res._getJSONData();
            // console.log(data);

            expect(data).toHaveLength(1);
            expect(res.statusCode).toBe(200);
            expect(res.status).not.toBe(404);
      });

      it('should retrieve 0 budget for user with ID 10', async () => {
            const req = createRequest({
                  method: 'GET',
                  url: 'api/budget',
                  user: { id: 10 }
            });
            const res = createResponse();

            const updateBudgets = budgets.filter(budget => budget.userId === req.user.id);

            (BudgetModel.findAll as jest.Mock).mockResolvedValue(updateBudgets);
            await BudgetController.getAll(req, res);

            const data = res._getJSONData();
            // console.log(data);

            expect(data).toHaveLength(0);
            expect(res.statusCode).toBe(200);
            expect(res.status).not.toBe(404);
      });
});