import sequelize from '../db/connection.js';

export const buildPopularRecipesWhereConditions = (filters) => {
  const { category, area, ingredient } = filters;
  const whereConditions = [];
  const replacements = {};

  if (category) {
    whereConditions.push('r."categoryId" = :category');
    replacements.category = category;
  }

  if (area) {
    whereConditions.push('r."areaId" = :area');
    replacements.area = area;
  }

  if (ingredient) {
    whereConditions.push(
      'EXISTS (SELECT 1 FROM "recipe-ingredients" ri JOIN ingredients i ON ri."ingredientId" = i.id WHERE ri."recipeId" = r.id AND i.name ILIKE :ingredient)'
    );
    replacements.ingredient = `%${ingredient}%`;
  }

  return { whereConditions, replacements };
};

export const executePopularRecipesQuery = async ({ limit, offset, whereConditions, replacements }) => {
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
  const query = `
    SELECT r.*, COUNT(f.id) as favorites_count
    FROM recipes r
    LEFT JOIN favorites f ON r.id = f."recipeId"
    ${whereClause}
    GROUP BY r.id
    ORDER BY favorites_count DESC
    LIMIT :limit OFFSET :offset
  `;

  return await sequelize.query(query, {
    replacements: { ...replacements, limit, offset },
    type: sequelize.QueryTypes.SELECT
  });
};

export const getPopularRecipesTotalCount = async (whereConditions, replacements) => {
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
  
  const countQuery = `SELECT COUNT(*) as total FROM recipes r ${whereClause}`;
  
  const countResult = await sequelize.query(countQuery, {
    replacements: Object.fromEntries(
      Object.entries(replacements).filter(([key]) => key !== 'limit' && key !== 'offset')
    ),
    type: sequelize.QueryTypes.SELECT
  });
  
  return parseInt(countResult[0].total);
};
