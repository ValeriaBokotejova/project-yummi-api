import express from 'express';
import { getAllIngredients } from '../controllers/ingredientsController.js';

const ingredientsRouter = express.Router();

ingredientsRouter.get("", getAllIngredients);

export default ingredientsRouter;