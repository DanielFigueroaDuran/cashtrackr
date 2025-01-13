import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { validateBudgetExist, validateBudgetId } from '../middleware/budget';

const router = Router();

router.get('/', BudgetController.getAll);

router.post('/',
      body('name')
            .notEmpty().withMessage('El nombre del presupuesto no puede ir vacio'),
      body('amount')
            .notEmpty().withMessage('La cantidad del presupuesto no puede ir vacia')
            .isNumeric().withMessage('Cantidad no valida')
            .custom(value => value > 0).withMessage('EL presupuesto debe ser mayor de 0'),
      handleInputErrors,
      BudgetController.create
);

router.get('/:id',
      validateBudgetId,
      validateBudgetExist,
      BudgetController.getById
);

router.put('/:id',
      validateBudgetId,
      body('name')
            .notEmpty().withMessage('El nombre del presupuesto no puede ir vacio'),
      body('amount')
            .notEmpty().withMessage('La cantidad del presupuesto no puede ir vacia')
            .isNumeric().withMessage('Cantidad no valida')
            .custom(value => value > 0).withMessage('EL presupuesto debe ser mayor de 0'),
      handleInputErrors,
      BudgetController.updateById
);

router.delete('/:id',
      validateBudgetId,
      BudgetController.deleteById
);





export default router;