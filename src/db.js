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
    locations: locations(db),
    categories: categories(db),
    favorites: favorites(db),
    reviews: reviews(db),
  }
}

const categories = (db) => ({
  getAll: async () => (await db.query(`SELECT * FROM categories`)).rows,
})

const reviews = (db) => ({
  getByUser: async (userId) => (await db.query(`SELECT * FROM reviews WHERE user_id = $1`, [userId])).rows,
  getByLocation: async (locationId) => (await db.query(`
    SELECT * FROM reviews r JOIN users u ON r.user_id = u.id 
    WHERE location_id = $1`, [locationId])).rows,
  create: async (userId, locationId, rating, comment) => {
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
  },
})

const favorites = (db) => ({
  getByUser: async (userId) => (await db.query(`SELECT * FROM favorites WHERE user_id = $1`, [userId])).rows,
  toggle: async (userId, locationId) => {
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
})

const locations = (db) => ({
  getAll: async (userId) =>  {
    const { rows: locations } = await db.query(`
      SELECT l.id AS id,
        l.name AS name,
        l.street AS street,
        l.house_number AS "houseNumber",
        l.zip_code AS "zipCode",
        l.place AS place,
        l.country AS country,
        l.category_id AS category_id,
        ROUND(COALESCE(AVG(r.rating), 0), 1) AS rating
      FROM locations l LEFT JOIN reviews r ON l.id = r.location_id
      GROUP BY l.id, l.name`);
    const myReviews = await reviews(db).getByUser(userId);
    const allCategories = await categories(db).getAll();
    const myFavorites = await favorites(db).getByUser(userId);
    for (const location of locations) {
      location.category = allCategories.find(category => category.id === location.category_id).name;
      location.isFavorited = myFavorites.some(favorite => favorite.location_id === location.id && favorite.user_id === userId);
      location.myReview = myReviews.find(review => review.location_id === location.id && review.user_id === userId);
      location.reviews = await reviews(db).getByLocation(location.id);
    }
    return locations;
  },
  getFavorites: async (userId) => {
    const { rows: locations } = await db.query(`
      SELECT l.id AS id,
        l.name AS name,
        l.street AS street,
        l.house_number AS "houseNumber",
        l.zip_code AS "zipCode",
        l.place AS place,
        l.country AS country,
        l.category_id AS category_id,
        ROUND(COALESCE(AVG(r.rating), 0), 1) AS rating
      FROM locations l JOIN favorites f ON l.id = f.location_id
      LEFT JOIN reviews r ON f.location_id = r.location_id WHERE f.user_id = $1
      GROUP BY l.id, l.name`, [userId]);
    const myReviews = await reviews(db).getByUser(userId);
    const allCategories = await categories(db).getAll();
    for (const location of locations) {
      location.category = allCategories.find(category => category.id === location.category_id).name;
      location.isFavorited = true;
      location.myReview = myReviews.find(review => review.location_id === location.id && review.user_id === userId);
      location.reviews = await reviews(db).getByLocation(location.id);
    }
    return locations;
  },
  create: async (db, name, street, houseNumber, zipCode, place, country, categoryId) => {
    await db.query(
      `INSERT INTO locations (name, street, house_number, zip_code, place, country, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [name, street, houseNumber, zipCode, place, country, categoryId]
    );
  }
})