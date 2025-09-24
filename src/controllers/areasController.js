import { listOfAreas } from '../services/areasService.js';


export const getAllAreas = async (req, res, next) => {
  try {
    const areas = await listOfAreas()
    return res.status(200).json(areas);
  } catch (error) {
    next(error);
  }
};

