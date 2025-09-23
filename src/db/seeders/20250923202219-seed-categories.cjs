'use strict';

/* global process */

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const dataPath = path.join(process.cwd(), 'data', 'categories.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const items = JSON.parse(raw);
    const records = items.map(i => ({
      id: queryInterface.sequelize.literal('gen_random_uuid()'),
      name: i.name,
    }));

    await queryInterface.bulkInsert('categories', records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
