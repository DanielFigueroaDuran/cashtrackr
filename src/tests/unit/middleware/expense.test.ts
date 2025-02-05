import { createRequest, createResponse } from "node-mocks-http";
import { validateExpenseExist } from "../../../middleware/expense";
import ExpenseModel from "../../../models/ExpenseModel";
import { expenses } from "../../mocks/expenses";

jest.mock('../../../models/ExpenseModel', () => ({
      findByPk: jest.fn()
}));

describe('Expenses Middleware - validateExpenseExists', () => {
      beforeEach(() => {
            (ExpenseModel.findByPk as jest.Mock).mockImplementation((id) => {
                  const expense = expenses.filter(e => e.id === id)[0] ?? null;
                  return Promise.resolve(expense);
            });
      });

      it('should hanble a not-existent budget', async () => {
            const req = createRequest({
                  params: { expenseId: 123 }
            });
            const res = createResponse();
            const next = jest.fn();

            await validateExpenseExist(req, res, next);

            const data = res._getJSONData();
            expect(res.statusCode).toBe(404);
            expect(data).toEqual({ error: 'Gasto no encontrado' });
            expect(next).not.toHaveBeenCalled();
      });
});