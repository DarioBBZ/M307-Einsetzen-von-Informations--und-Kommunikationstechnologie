import { createDB } from "./src/db.js";
import { createServer } from "./src/server.js";

const server = createServer();
const db = createDB();

// Home page
server.get("/", async (req, res) => {
  const user = await db.auth.loggedInUser(req);
  return res.render("home", {
    user,
    locations: await db.locations(user.id),
  });
});

// Favorite management
server.post("/favorite", async (req, res) => {
  const user = await db.auth.loggedInUser(req);
  if (user) {
    await db.toggleFavoriteLocation(user.id, req.body.locationId);
  }
  res.redirect("/");
});

// User management
server.post("/login", async (req, res) => {
  const success = await db.auth.loginUser(req);
  if (success) {
  res.redirect("/");
  } else {
    res.render("alert", { message: "Login failed!" });
  }
});

server.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
server.listen(3010, () => {
  console.log(`🚀 M307 Dario & Chiara server running at http://localhost:3010`);
});
