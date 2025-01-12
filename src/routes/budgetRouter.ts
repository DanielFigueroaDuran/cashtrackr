import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

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

router.get('/:id', BudgetController.getById);
router.put('/:id', BudgetController.updateById);
router.delete('/:id', BudgetController.deleteById);





export default router;