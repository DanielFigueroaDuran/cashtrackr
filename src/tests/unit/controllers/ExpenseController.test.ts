import { createRequest, createResponse } from "node-mocks-http";
import ExpenseModel from "../../../models/ExpenseModel";
import { ExpensesController } from '../../../controllers/ExpenseController';
import { expenses } from "../../mocks/expenses";

jest.mock('../../../models/ExpenseModel', () => ({
      create: jest.fn()
}));

describe('ExpensesController.create', () => {

      it('should create a new expense', async () => {
            const expenseMock = {
                  save: jest.fn()
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

      it('should handle expense creation error', async () => {
            const expenseMock = {
                  save: jest.fn()
            };

            (ExpenseModel.create as jest.Mock).mockRejectedValue(new Error);

            const req = createRequest({
                  method: 'POST',
                  url: '/api/budgets/:budgetId/expenses',
                  body: { name: 'Test Expenses', amount: 530 },
                  budget: { id: 1 }
            });
            const res = createResponse();

            await ExpensesController.create(req, res);

            const data = res._getJSONData();
            expect(res.statusCode).toBe(500);
            expect(data).toEqual({ error: 'Hubo un error' });
            expect(expenseMock.save).not.toHaveBeenCalled();
            expect(ExpenseModel.create).toHaveBeenCalledWith(req.body);

      });
});

describe('ExpensesController.getById', () => {
      it('should return expense with ID', async () => {
            const req = createRequest({
                  method: 'GET',
                  url: '/api/budgets/:budgetId/expenses/:expenseId',
                  expense: expenses[0]
            });
            const res = createResponse();

            await ExpensesController.getById(req, res);

            const data = res._getJSONData();
            expect(res.statusCode).toBe(200);
            expect(data).toEqual(expenses[0]);
      });
});

describe('ExpensesController.updateById', () => {
      it('should return expense with ID', async () => {
            const expenseMock = {
                  ...expenses[0],
                  update: jest.fn().mockResolvedValue(true)
            };

            const req = createRequest({
                  method: 'PUT',
                  url: '/api/budgets/:budgetId/expenses/:expenseId',
                  expense: expenseMock,
                  body: { name: 'Updated Expense', amount: 100 }
            });
            const res = createResponse();

            await ExpensesController.updateById(req, res);

            const data = res._getJSONData();
            expect(res.statusCode).toBe(200);
            expect(data).toEqual('Se Actualizó Correctamente');
            expect(expenseMock.update).toHaveBeenCalled();
            expect(expenseMock.update).toHaveBeenCalledWith(req.body);
            expect(expenseMock.update).toHaveBeenCalledTimes(1);
      });
});