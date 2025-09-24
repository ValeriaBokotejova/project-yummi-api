import { getAreaByName, listOfAreas } from '../services/areasService.js';


export const getAllAreas = async (req, res, next) => {
  try {
    const areas = await listOfAreas()
    return res.status(201).json(areas);
  } catch (error) {
    next(error);
  }
};

export const getOneAreaByName = async (req, res, next) => {
  try {
    const areas = await getAreaByName()
    return res.status(201).json(areas);
  } catch (error) {
    next(error);
  }
};