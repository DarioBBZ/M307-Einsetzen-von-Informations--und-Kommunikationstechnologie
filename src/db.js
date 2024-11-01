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
  };
}