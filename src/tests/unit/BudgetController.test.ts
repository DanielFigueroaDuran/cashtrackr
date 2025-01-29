import { createRequest, createResponse } from "node-mocks-http";
import { budgets } from '../mocks/budgets';
import { BudgetController } from "../../controllers/BudgetController";
import BudgetModel from "../../models/BudgetModel";
import ExpenseModel from "../../models/ExpenseModel";

jest.mock('../../models/BudgetModel', () => ({
      findAll: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn()
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

      it('Should handle budget creation error', async () => {
            const mockBudget = {
                  save: jest.fn()
            };

            (BudgetModel.create as jest.Mock).mockRejectedValue(new Error);
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

            expect(res.statusCode).toBe(500);
            expect(data).toEqual({ error: 'Hubo un Error' });

            expect(mockBudget.save).not.toHaveBeenCalled();
            expect(BudgetModel.create).toHaveBeenCalledWith(req.body);
      });

      describe('BudgetController.getById', () => {

            beforeEach(() => {
                  (BudgetModel.findByPk as jest.Mock).mockImplementation((id) => {
                        //console.log(id);
                        const budget = budgets.filter(b => b.id === id)[0]
                        return Promise.resolve(budget);
                  });
            });

            it('should return a budget wit ID 1 and 3 expenses', async () => {
                  const req = createRequest({
                        method: 'GET',
                        url: 'api/budget/budgetId',
                        budget: { id: 1 }

                  });
                  const res = createResponse();
                  await BudgetController.getById(req, res);

                  const data = res._getJSONData();
                  expect(res.statusCode).toBe(200);
                  expect(data.expenses).toHaveLength(3);
                  expect(BudgetModel.findByPk).toHaveBeenCalled();
                  expect(BudgetModel.findByPk).toHaveBeenCalledTimes(1);
                  expect(BudgetModel.findByPk).toHaveBeenCalledWith(req.budget.id, {
                        include: [ExpenseModel]
                  });
            });

            it('should return a budget wit ID 2 and 2 expenses', async () => {
                  const req = createRequest({
                        method: 'GET',
                        url: 'api/budget/:budgetId',
                        budget: { id: 2 }

                  });
                  const res = createResponse();
                  await BudgetController.getById(req, res);

                  const data = res._getJSONData();
                  expect(res.statusCode).toBe(200);
                  expect(data.expenses).toHaveLength(2);
            });

            it('should return a budget wit ID 3 and 0 expenses', async () => {
                  const req = createRequest({
                        method: 'GET',
                        url: 'api/budget/:budgetId',
                        budget: { id: 3 }

                  });
                  const res = createResponse();
                  await BudgetController.getById(req, res);

                  const data = res._getJSONData();
                  expect(res.statusCode).toBe(200);
                  expect(data.expenses).toHaveLength(0);
            });
      });

      describe('BudgetController.updateById', () => {
            it('shoud update the budget and return a success message', async () => {
                  const budgetMock = {
                        update: jest.fn().mockResolvedValue(true)
                  };

                  const req = createRequest({
                        method: 'PUT',
                        url: 'api/budget/:budgetId',
                        budget: budgetMock,
                        body: { name: 'Presupuesto Actualizado', amount: 5000 }
                  });
                  const res = createResponse();
                  await BudgetController.updateById(req, res);

                  const data = res._getJSONData();
                  expect(res.statusCode).toBe(200);
                  expect(data).toBe('Presupuesto Actualizado Correctamente');
                  expect(budgetMock.update).toHaveBeenCalled();
                  expect(budgetMock.update).toHaveBeenCalledTimes(1);
                  expect(budgetMock.update).toHaveBeenCalledWith(req.body);

            });
      });

      describe('BudgetController.deleteById', () => {
            it('shoud delete budget and return a success message', async () => {
                  const budgetMock = {
                        destroy: jest.fn().mockResolvedValue(true)
                  };

                  const req = createRequest({
                        method: 'DELETE',
                        url: 'api/budget/:budgetId',
                        budget: budgetMock
                  });
                  const res = createResponse();
                  await BudgetController.deleteById(req, res);

                  const data = res._getJSONData();
                  expect(res.statusCode).toBe(200);
                  expect(data).toBe('Presupuesto eliminado correctamente');
                  expect(budgetMock.destroy).toHaveBeenCalled();
                  expect(budgetMock.destroy).toHaveBeenCalledTimes(1);
            });
      });
});