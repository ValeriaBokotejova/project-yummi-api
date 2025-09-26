import express from 'express';
import { getAllAreas } from '../controllers/areasController.js';

const areasRouter = express.Router();

areasRouter.get('', getAllAreas);

export default areasRouter;
