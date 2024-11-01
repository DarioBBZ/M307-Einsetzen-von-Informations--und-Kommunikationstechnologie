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
    toggleFavoriteLocation: async (userId, locationId) => toggleFavoriteLocation(db, userId, locationId)
  }
}

const toggleFavoriteLocation = async (db, userId, locationId) => {
  const { rows } = await db.query(
    `SELECT 1 FROM favorites WHERE user_id = $1 AND location_id = $2`,
    [userId, locationId]
  );

  if (rows.length === 0) {
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