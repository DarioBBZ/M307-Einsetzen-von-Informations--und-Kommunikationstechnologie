import pgPool from "pg";
import bbz307 from "bbz307";

export function createDB() {
  const db = new pgPool.Pool({
    user: "crimson_dawn_5481",
    host: "bbz.cloud",
    database: "crimson_dawn_5481",
    password: "896e8f91cd48506b11bd3628acc9b102",
    port: 30211,
  });

  return {
    auth: new bbz307.Login("users", ["name", "password"], db),
    locations: {
      getAll: async (userId) => (await db.query(locationsQuery(userId))).rows,
      getFavorites: async (userId) => (await db.query(locationsQuery(userId, true))).rows,
      toggleFavorite: async (userId, locationId) => toggleFavoriteLocation(db, userId, locationId),
      rate: async (userId, locationId, rating, comment) => rateLocation(db, userId, locationId, rating, comment),
    }
  }
}

const toggleFavoriteLocation = async (db, userId, locationId) => {
  const { rowCount } = await db.query(
    `SELECT 1 FROM favorites WHERE user_id = $1 AND location_id = $2`,
    [userId, locationId]
  );

  if (rowCount === 0) {
    await db.query(
      `INSERT INTO favorites (user_id, location_id) VALUES ($1, $2)`,
      [userId, locationId]
    );
  } else {
    await db.query(
      `DELETE FROM favorites WHERE user_id = $1 AND location_id = $2`,
      [userId, locationId]
    );
  }
}

const rateLocation = async (db, userId, locationId, rating, comment) => {
  const { rowCount } = await db.query(
    `SELECT 1 FROM reviews WHERE user_id = $1 AND location_id = $2`,
    [userId, locationId]
  );

  if (rowCount === 0) {
    await db.query(
      `INSERT INTO reviews (user_id, location_id, rating, comment) VALUES ($1, $2, $3, $4)`,
      [userId, locationId, rating, comment]
    );
  }
  else {
    await db.query(
      `UPDATE reviews SET rating = $3, comment = $4 WHERE user_id = $1 AND location_id = $2`,
      [userId, locationId, rating, comment]
    );
  }
}

const locationsQuery = (userId, isFavorites) => `
SELECT 
    l.id AS id,
    l.name AS name,
    l.street AS street,
    l.house_number AS "houseNumber",
    l.zip_code AS "zipCode",
    l.place AS place,
    l.country AS country,
    ROUND(AVG(r.rating), 1) AS rating,
    t.name AS category,
    ${userId ? `
        EXISTS (
            SELECT 1
            FROM favorites f
            WHERE f.location_id = l.id AND f.user_id = ${userId}
        ) AS "isFavorited",
        COALESCE(
           JSON_BUILD_OBJECT(
               'rating', ur.rating,
               'comment', ur.comment
           ), 
           NULL
        ) AS "myReview",
    ` : `
        FALSE AS "isFavorited",
        NULL AS "myReview",
    `}
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'name', u.name,
            'rating', r.rating,
            'comment', r.comment
        )
    ) AS reviews
FROM 
    locations l
JOIN 
    reviews r ON l.id = r.location_id
JOIN 
    users u ON r.user_id = u.id
JOIN 
    categories t ON l.category_id = t.id
${userId ? `LEFT JOIN reviews ur ON l.id = ur.location_id AND ur.user_id = ${userId}` : ''}
${isFavorites && userId ? `JOIN favorites f ON l.id = f.location_id AND f.user_id = ${userId}` : ''}
GROUP BY 
    l.id, t.name ${userId ? `,ur.rating,ur.comment` : ``};
`;