import { createApp } from "./config.js";

const app = createApp({
  user: "autumn_star_7622",
  host: "168.119.168.41",
  database: "demo",
  password: "uaioysdfjoysfdf",
  port: 18324,
});

/* Startseite */
app.get("/", async function (req, res) {
  res.render("home", {
    data: [
      {
        name: "SYPROS-GYROS",
        rating: 4.5,
        category: "Restaurant",
        reviews: [
          {
            username: "John Doe",
            rating: 5,
            text: "Amazing gyros! The flavors were authentic and the service was excellent.",
          },
          {
            username: "Jane Smith",
            rating: 4,
            text: "Good food, but the wait was a bit long. Worth it for the taste though!",
          },
          {
            username: "Alex99",
            rating: 4.5,
            text: "Loved the ambiance and the gyros were top-notch. Highly recommend!",
          },
        ],
      },
      {
        name: "TUUBE",
        rating: 4.5,
        category: "Bar",
        reviews: [],
      },
    ],
  });
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
