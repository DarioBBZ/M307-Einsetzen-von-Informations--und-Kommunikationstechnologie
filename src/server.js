import express from "express";
import expressHandlebars from "express-handlebars";
import sessions from "express-session";
import path from "path";
import fs from "fs";

export default class Server {
  constructor() {
    const server = express();

    server.use(express.static("public"));
    server.use(express.urlencoded({ extended: true }));

    server.engine("handlebars", this.engine);
    server.set("view engine", "handlebars");

    server.use(
      sessions({
        secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
        saveUninitialized: true,
        cookie: { maxAge: 86400000, secure: false },
        resave: false,
      })
    );

    return server;
  }

  engine = expressHandlebars.engine({
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
      eq: function (a, b) {
        return a === b;
      },
    },
  });
}
