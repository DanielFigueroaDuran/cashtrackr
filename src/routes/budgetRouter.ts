import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from "express-validator";
import { handleInputErrors } from '../middleware/validation';
import { validateBudgetExist, validateBudgetId, validateBudgetInput } from '../middleware/budget';

const router = Router();

//Every time we pass a parameter this code will be executed first

router.param('budgetId', validateBudgetId);
router.param('budgetId', validateBudgetExist);

router.get('/', BudgetController.getAll);

router.post('/',
      validateBudgetInput,
      handleInputErrors,
      BudgetController.create
);

router.get('/:budgetId', BudgetController.getById);

router.put('/:budgetId',
      validateBudgetInput,
      handleInputErrors,
      BudgetController.updateById
);

router.delete('/:budgetId', BudgetController.deleteById);


export default router;