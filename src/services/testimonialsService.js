import { Testimonial, User } from '../db/models/index.js';

export const listOfTestimonials = async () => {
  return await Testimonial.findAll({
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'avatarUrl'],
      },
    ],
  });
};

