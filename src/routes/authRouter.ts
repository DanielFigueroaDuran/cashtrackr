import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from '../middleware/validation';

const router = Router();

router.post('/create-account',
      body('name')
            .notEmpty().withMessage('El nombre no puede ir vacio'),
      body('password')
            .isLength({ min: 8 }).withMessage('El password es muy corto, mínimo 8 caracteres'),
      body('email')
            .isEmail().withMessage('E-mail no válido'),
      handleInputErrors,
      AuthController.createAccount
);

router.post('/confirm-account',
      body('token')
            .notEmpty()
            .isLength({ min: 6, max: 6 })
            .withMessage('Token no válido'),
      handleInputErrors,
      AuthController.confirmAccount
);

export default router