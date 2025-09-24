'use strict';

/* global process */

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const items = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'testimonials.json'), 'utf8'));
    const usersRaw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'users.json'), 'utf8'));
    const usersRawMap = Object.fromEntries(usersRaw.map(u => [u._id?.$oid || u._id, u.name]));

    const users = await queryInterface.sequelize.query('SELECT id, name FROM users;', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    const userMap = Object.fromEntries(users.map(u => [u.name, u.id]));

    const records = items.map(i => ({
      id: queryInterface.sequelize.literal('gen_random_uuid()'),
      testimonial: i.testimonial || '',
      ownerId: userMap[usersRawMap[i.owner?.$oid || i.owner]] || null,
      createdAt: i.createdAt?.$date ? new Date(Number(i.createdAt.$date.$numberLong)) : new Date(),
      updatedAt: i.updatedAt?.$date ? new Date(Number(i.updatedAt.$date.$numberLong)) : new Date(),
    }));

    await queryInterface.bulkInsert('testimonials', records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('testimonials', null, {});
  },
};
