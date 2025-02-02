import { createRequest, createResponse } from "node-mocks-http";
import ExpenseModel from "../../../models/ExpenseModel";
import { ExpensesController } from "../../../controllers/ExpenseController";

jest.mock('../../../models/ExpenseModel', () => ({
      create: jest.fn()
}));

describe('ExpensesController.create', () => {

      it('should create a new expense', async () => {
            const expenseMock = {
                  save: jest.fn().mockResolvedValue(true)
            };

            (ExpenseModel.create as jest.Mock).mockResolvedValue(expenseMock);

            const req = createRequest({
                  method: 'POST',
                  url: '/api/budgets/:budgetId/expenses',
                  body: { name: 'Test Expenses', amount: 530 },
                  budget: { id: 1 }
            });
            const res = createResponse();

            await ExpensesController.create(req, res);

            const data = res._getJSONData();
            expect(res.statusCode).toBe(201);
            expect(data).toEqual('Gasto agregado correctamente');
            expect(expenseMock.save).toHaveBeenCalled();
            expect(expenseMock.save).toHaveBeenCalledTimes(1);
            expect(ExpenseModel.create).toHaveBeenCalledWith(req.body);

      });
});