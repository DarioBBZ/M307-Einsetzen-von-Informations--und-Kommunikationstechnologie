import { createDB } from "./src/db.js";
import { createServer } from "./src/server.js";

const server = createServer();
const db = createDB();

server.get("/", async (req, res) => {
  return res.render("home", {
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

// User management
server.post("/login", async (req, res) => {
  await db.auth.loginUser(req);
  res.redirect("/");
});
server.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
server.listen(3010, () => {
  console.log(`🚀 M307 Dario & Chiara server running at http://localhost:3010`);
});
