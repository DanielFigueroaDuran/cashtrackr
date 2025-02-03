import { createRequest, createResponse } from "node-mocks-http";
import { validateExpenseExist } from "../../../middleware/expense";
import ExpenseModel from "../../../models/ExpenseModel";
import { expenses } from "../../mocks/expenses";

jest.mock('../../../models/ExpenseModel', () => ({
      findByPk: jest.fn()
}));

describe('Expenses Middleware - validateExpenseExists', () => {
      it('should hanble a not-existent budget', async () => {

      });
});