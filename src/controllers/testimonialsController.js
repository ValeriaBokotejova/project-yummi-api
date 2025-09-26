import { listOfTestimonials } from '../services/testimonialsService.js';

export const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await listOfTestimonials();
    return res.status(200).json(testimonials);
  } catch (error) {
    next(error);
  }
};
