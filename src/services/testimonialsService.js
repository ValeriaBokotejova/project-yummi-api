import { Testimonial } from '../db/models/index.js';

export const listOfTestimonials = async () => {
  return await Testimonial.findAll();
};

