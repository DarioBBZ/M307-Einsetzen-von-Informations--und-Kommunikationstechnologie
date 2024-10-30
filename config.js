import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import sessions from "express-session";
import path from "path";
import fs from "fs";

export function createApp(dbconfig) {
  const app = express();

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.engine("handlebars", ENGINE);
  app.set("view engine", "handlebars");

  const pool = new Pool(dbconfig);
  app.locals.pool = pool;

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );

  return app;
}

const ENGINE = engine({
  helpers: {
    icon: function (name) {
      try {
        // Read the SVG file from the public/icons directory
        const iconPath = path.resolve("public/icons", name + ".svg");
        // Return the content of the SVG file
        return fs.readFileSync(iconPath, "utf8");
      } catch (err) {
        console.error("Error reading SVG file:", err);
        return "";
      }
    },
    stars: function (rating) {
      let fullStars = Math.floor(rating);
      let halfStar = rating % 1 >= 0.5 ? 1 : 0;
      let emptyStars = 5 - fullStars - halfStar;

      let stars = [];

      // full stars
      for (let i = 0; i < fullStars; i++) {
        stars.push("star-full");
      }

      // half star if applicable
      if (halfStar) {
        stars.push("star-half-full");
      }

      // empty stars
      for (let i = 0; i < emptyStars; i++) {
        stars.push("star");
      }

      return stars;
    },
  },
});
