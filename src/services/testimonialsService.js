import { Testimonial } from '../db/models/index.js';

export const listOfTestimonials = () => Testimonial.findAll();

