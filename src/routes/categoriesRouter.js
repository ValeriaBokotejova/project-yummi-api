import express from 'express';
import { getAllCategories } from '../controllers/categoriesController.js';

const categoriesRouter = express.Router();

categoriesRouter.get('', getAllCategories);

export default categoriesRouter;
