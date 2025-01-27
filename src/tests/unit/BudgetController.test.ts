import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from "../mocks/budgets";
import { BudgetController } from "../../controllers/BudgetController";
import BudgetModel from "../../models/BudgetModel";

jest.mock('../../models/BudgetModel', () => ({
      findAll: jest.fn(),
      create: jest.fn()
}));

describe('BudgetController.getAll', () => {

      beforeEach(() => {
            //console.log('Arrancando nuevo test...');
            (BudgetModel.findAll as jest.Mock).mockReset(); //restart the mock every time it finishes
            (BudgetModel.findAll as jest.Mock).mockImplementation((options) => {
                  const updateBudgets = budgets.filter(budget => budget.userId === options.where.userId);
                  return Promise.resolve(updateBudgets);
            });
      });

      it('should retrieve 2 budget for user with ID 1', async () => {
            const req = createRequest({
                  method: 'GET',
                  url: 'api/budget',
                  user: { id: 1 }
            });
            const res = createResponse();
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
                  user: { id: 100 }
            });
            const res = createResponse();
            await BudgetController.getAll(req, res);

            const data = res._getJSONData();
            // console.log(data);
            expect(data).toHaveLength(0);
            expect(res.statusCode).toBe(200);
            expect(res.status).not.toBe(404);
      });

      it('should handle errors when fetching budget ', async () => {
            const req = createRequest({
                  method: 'GET',
                  url: 'api/budget',
                  user: { id: 100 }
            });
            const res = createResponse();

            (BudgetModel.findAll as jest.Mock).mockRejectedValue(new Error)
            await BudgetController.getAll(req, res)

            expect(res.statusCode).toBe(500)
            expect(res._getJSONData()).toEqual({ error: 'Hubo un Error' })
      });
});

describe('BudgetController.create', () => {
      it('Should create a new budget and respond with statusCode 201', async () => {

            const mockBudget = {
                  save: jest.fn().mockResolvedValue(true)
            };

            (BudgetModel.create as jest.Mock).mockResolvedValue(mockBudget);
            const req = createRequest({
                  method: 'POST',
                  url: 'api/budget',
                  user: { id: 1 },
                  body: { name: 'Presupuesto Prueba', amount: 1000 }
            });
            const res = createResponse();
            await BudgetController.create(req, res);

            const data = res._getJSONData();
            // console.log(data);

            expect(res.statusCode).toBe(201);
            expect(data).toBe('Presupuesto Creado Correctamente');
            expect(mockBudget.save).toHaveBeenCalled();
            expect(mockBudget.save).toHaveBeenCalledTimes(1);
            expect(BudgetModel.create).toHaveBeenCalledWith(req.body);
      });
});