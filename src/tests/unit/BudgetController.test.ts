import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../mocks/budgets";
import { BudgetController } from "../../controllers/BudgetController";
import BudgetModel from "../../models/BudgetModel";

jest.mock('../../models/BudgetModel', () => ({
      findAll: jest.fn()
}));

describe('BudgetController.getAll', () => {
      it('should retrieve budget', async () => {
            const req = createRequest({
                  method: 'GET',
                  url: 'api/budget',
                  user: { id: 500 }
            });
            const res = createResponse();

            await BudgetController.getAll(req, res);

            (BudgetModel.findAll as jest.Mock).mockResolvedValue(budgets);
            await BudgetController.getAll(req, res);

            const data = res._getJSONData();

            console.log(data);
      });
});