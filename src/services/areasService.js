import { Area } from '../db/models/index.js';

export const listOfAreas = () =>Area.findAll();

