'use strict';

/* global process */

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const items = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'recipes.json'), 'utf8'));
    const usersRaw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'users.json'), 'utf8'));
    const usersRawMap = Object.fromEntries(usersRaw.map(u => [u._id?.$oid || u._id, u.name]));

    // We'll need to resolve category and area names to their IDs — assume they were seeded already
    const categories = await queryInterface.sequelize.query('SELECT id, name FROM categories;', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });
    const areas = await queryInterface.sequelize.query('SELECT id, name FROM areas;', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });
    const users = await queryInterface.sequelize.query('SELECT id, name FROM users;', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    const catMap = Object.fromEntries(categories.map(c => [c.name, c.id]));
    const areaMap = Object.fromEntries(areas.map(a => [a.name, a.id]));
    const userMap = Object.fromEntries(users.map(u => [u.name, u.id]));

    const records = items.map(i => ({
      id: queryInterface.sequelize.literal('gen_random_uuid()'),
      title: i.title,
      description: i.description || '',
      instructions: i.instructions || '',
      thumbUrl: i.thumb || null,
      time: parseInt(i.time, 10) || 0,
      ownerId: userMap[usersRawMap[i.owner?.$oid || i.owner]],
      categoryId: catMap[i.category] || null,
      areaId: areaMap[i.area] || null,
      createdAt: i.createdAt?.$date ? new Date(Number(i.createdAt.$date.$numberLong)) : new Date(),
      updatedAt: i.updatedAt?.$date ? new Date(Number(i.updatedAt.$date.$numberLong)) : new Date(),
    }));

    await queryInterface.bulkInsert('recipes', records, {});

    // Also populate recipe_ingredients junction table
    const ingredients = await queryInterface.sequelize.query('SELECT id FROM ingredients;', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });
    const ingredientIds = new Set(ingredients.map(i => i.id));

    const junctionRecords = [];
    items.forEach(i => {
      const recipeId = i._id?.$oid || i._id;
      (i.ingredients || []).forEach(ing => {
        const ingId = ing.id;
        // If ingredient exists in ingredients table, create junction row
        if (ingredientIds.has(ingId)) {
          junctionRecords.push({
            id: `${recipeId}-${ingId}`,
            recipeId,
            ingredientId: ingId,
          });
        }
      });
    });

    if (junctionRecords.length) {
      await queryInterface.bulkInsert('recipe_ingredients', junctionRecords, {});
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('recipes', null, {});
    await queryInterface.bulkDelete('recipe_ingredients', null, {});
  },
};
