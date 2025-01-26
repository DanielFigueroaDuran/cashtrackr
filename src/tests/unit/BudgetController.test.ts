import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../mocks/budgets";
import { BudgetController } from "../../controllers/BudgetController";

describe('BudgetController.getAll', () => {
      it('should retrieve budget', async () => {
            const req = createRequest({
                  method: 'GET',
                  url: 'api/budget',
                  user: { id: 500 }
            });
            const res = createResponse();

            await BudgetController.getAll(req, res);

            console.log(res._getJSONData);
      });
});