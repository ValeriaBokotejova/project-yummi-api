import { Area } from '../db/models/index.js';

export const listOfAreas = () =>Area.findAll();

export const getAreaByName = (areaName) => Area.findOne({ where: {name: areaName }});