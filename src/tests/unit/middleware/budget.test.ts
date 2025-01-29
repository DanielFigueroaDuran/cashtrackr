import { createRequest, createResponse } from "node-mocks-http";
import { validateBudgetExist } from "../../../middleware/budget";
import BudgetModel from "../../../models/BudgetModel";

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
});