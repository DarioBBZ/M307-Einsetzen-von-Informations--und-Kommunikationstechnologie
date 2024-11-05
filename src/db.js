import pgPool from "pg";
import bbz307 from "bbz307";

export default class Database {
  constructor() {
    this.db = new pgPool.Pool({
      user: "crimson_dawn_5481",
      host: "bbz.cloud",
      database: "crimson_dawn_5481",
      password: "896e8f91cd48506b11bd3628acc9b102",
      port: 30211,
    });
    this.auth = new bbz307.Login("users", ["name", "password"], this.db);
  }

  categories = {
    getAll: async () => (await this.db.query("SELECT * FROM categories")).rows,
  };

  reviews = {
    getByUser: async (userId) =>
      (
        await this.db.query("SELECT * FROM reviews WHERE user_id = $1", [
          userId,
        ])
      ).rows,
    getByLocation: async (locationId) =>
      (
        await this.db.query(
          "SELECT * FROM reviews r JOIN users u ON r.user_id = u.id WHERE location_id = $1",
          [locationId]
        )
      ).rows,
    createOrUpdate: async (userId, locationId, rating, comment) => {
      const { rowCount } = await this.db.query(
        "SELECT 1 FROM reviews WHERE user_id = $1 AND location_id = $2",
        [userId, locationId]
      );

      if (rowCount === 0) {
        await this.db.query(
          "INSERT INTO reviews (user_id, location_id, rating, comment) VALUES ($1, $2, $3, $4)",
          [userId, locationId, rating, comment]
        );
      } else {
        await this.db.query(
          "UPDATE reviews SET rating = $3, comment = $4 WHERE user_id = $1 AND location_id = $2",
          [userId, locationId, rating, comment]
        );
      }
    },
  };

  favorites = {
    getByUser: async (userId) =>
      (
        await this.db.query("SELECT * FROM favorites WHERE user_id = $1", [
          userId,
        ])
      ).rows,
    toggle: async (userId, locationId) => {
      const { rowCount } = await this.db.query(
        "SELECT 1 FROM favorites WHERE user_id = $1 AND location_id = $2",
        [userId, locationId]
      );

      if (rowCount === 0) {
        await this.db.query(
          "INSERT INTO favorites (user_id, location_id) VALUES ($1, $2)",
          [userId, locationId]
        );
      } else {
        await this.db.query(
          "DELETE FROM favorites WHERE user_id = $1 AND location_id = $2",
          [userId, locationId]
        );
      }
    },
  };

  locations = {
    getAll: async (userId) => {
      const { rows: locations } = await this.db.query(
        `SELECT l.*, ROUND(COALESCE(AVG(r.rating), 0), 1) AS rating
        FROM locations l LEFT JOIN reviews r ON l.id = r.location_id
        GROUP BY l.id`
      );
      const myReviews = await this.reviews.getByUser(userId);
      const allCategories = await this.categories.getAll();
      const myFavorites = await this.favorites.getByUser(userId);
      for (const location of locations) {
        location.category = allCategories.find(
          (category) => category.id === location.category_id
        ).name;
        location.isFavorited = myFavorites.some(
          (favorite) =>
            favorite.location_id === location.id && favorite.user_id === userId
        );
        location.myReview = myReviews.find(
          (review) =>
            review.location_id === location.id && review.user_id === userId
        );
        location.reviews = await this.reviews.getByLocation(location.id);
      }
      return locations;
    },
    getFavorites: async (userId) => {
      const { rows: locations } = await this.db.query(
        `SELECT l.*, ROUND(COALESCE(AVG(r.rating), 0), 1) AS rating
        FROM locations l JOIN favorites f ON l.id = f.location_id
        LEFT JOIN reviews r ON f.location_id = r.location_id WHERE f.user_id = $1
        GROUP BY l.id`,
        [userId]
      );
      const myReviews = await this.reviews.getByUser(userId);
      const allCategories = await this.categories.getAll();
      for (const location of locations) {
        location.category = allCategories.find(
          (category) => category.id === location.category_id
        ).name;
        location.isFavorited = true;
        location.myReview = myReviews.find(
          (review) =>
            review.location_id === location.id && review.user_id === userId
        );
        location.reviews = await this.reviews.getByLocation(location.id);
      }
      return locations;
    },
    create: async (
      name,
      street,
      houseNumber,
      zipCode,
      place,
      country,
      categoryId
    ) => {
      // check if name is unique
      const { rowCount } = await this.db.query(
        "SELECT 1 FROM locations WHERE name = $1",
        [name]
      );

      if (rowCount === 0) {
        await this.db.query(
          "INSERT INTO locations (name, street, house_number, zip_code, place, country, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [name, street, houseNumber, zipCode, place, country, categoryId]
        );
      } else {
        throw new Error(`Location name "${name}" is already taken!`);
      }
    },
  };
}
