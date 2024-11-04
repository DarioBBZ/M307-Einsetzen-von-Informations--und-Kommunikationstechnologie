import { createDB } from "./src/db.js";
import { createServer } from "./src/server.js";

const server = createServer();
const db = createDB();

// Home page
server.get("/", async (req, res) => {
  const user = await db.auth.loggedInUser(req);
  return res.render("home", {
    user,
    locations: await db.locations.getAll(user.id),
  });
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

// Favorite management
server.get("/favorite", async (req, res) => {
  const user = await db.auth.loggedInUser(req);
  if (user) {
    return res.render("home", {
      user,
      locations: await db.locations.getFavorites(user.id),
      isFavorites: true,
    });
  }
  res.redirect("/");
});
server.post("/favorite", async (req, res) => {
  const user = await db.auth.loggedInUser(req);
  if (user) {
    await db.locations.toggleFavorite(user.id, req.body.locationId);
  }
  // Redirect back to the previous page
  res.redirect(req.get("Referer") || "/");
});

// rate location
server.post("/rate", async (req, res) => {
  const user = await db.auth.loggedInUser(req);
  if (user) {
    await db.locations.rate(user.id, req.body.locationId, req.body.rating, req.body.comment);
  }
  // Redirect back to the previous page
  res.redirect(req.get("Referer") || "/");
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
server.listen(3010, () => {
  console.log(`🚀 M307 Dario & Chiara server running at http://localhost:3010`);
});
