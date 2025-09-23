'use strict';

/* global process */

const fs = require('fs');
const path = require('path');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const recipesRaw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'recipes.json'), 'utf8'));
    const ingredientsRaw = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'ingredients.json'), 'utf8'));

    // Collect existing ingredient IDs from DB
    const ingredients = await queryInterface.sequelize.query('SELECT id, name FROM ingredients;', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });
    const recipes = await queryInterface.sequelize.query('SELECT id, title FROM recipes;', {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    const ingredientMap = Object.fromEntries(ingredients.map(i => [i.name, i.id]));
    const recipeMap = Object.fromEntries(recipes.map(r => [r.title, r.id]));
    const ingredientsRawMap = Object.fromEntries(ingredientsRaw.map(i => [i._id, i.name]));

    const junctionRecords = [];
    recipesRaw.forEach(i => {
      const recipeId = recipeMap[i.title];
      (i.ingredients || []).forEach(ing => {
        const ingId = ingredientMap[ingredientsRawMap[ing.id]];
        const measure = ing.measure || 'to taste';
        // if (ingredientSet.has(ingId)) {
        junctionRecords.push({
          // use DB-side UUID generation
          id: queryInterface.sequelize.literal('gen_random_uuid()'),
          recipeId,
          ingredientId: ingId,
          measure,
        });
        // }
      });
    });

    if (junctionRecords.length) {
      await queryInterface.bulkInsert('recipe_ingredients', junctionRecords, {});
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('recipe_ingredients', null, {});
  },
};
