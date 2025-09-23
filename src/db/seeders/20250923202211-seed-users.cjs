'use strict';

/* global process */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const dataPath = path.join(process.cwd(), 'data', 'users.json');
    const raw = fs.readFileSync(dataPath, 'utf8');
    const items = JSON.parse(raw);

    const hashed = await bcrypt.hash('Qwerty123', 10);

    const records = items.map(u => ({
      id: queryInterface.sequelize.literal('gen_random_uuid()'),
      name: u.name,
      avatarUrl: u.avatar || null,
      email: u.email,
      password: hashed,
    }));
    await queryInterface.bulkInsert('users', records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
