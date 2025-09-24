'use strict';

/* global process */
const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const dataPath = path.join(process.cwd(), 'data', 'ingredients.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const items = JSON.parse(raw);
    const records = items.map(i => ({
      id: queryInterface.sequelize.literal('gen_random_uuid()'),
      name: i.name,
      desc: i.desc || null,
      imgUrl: i.img || null,
    }));

    await queryInterface.bulkInsert('ingredients', records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ingredients', null, {});
  },
};
