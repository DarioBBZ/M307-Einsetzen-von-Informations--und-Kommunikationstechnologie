import Database from "./src/db.js";
import Server from "./src/server.js";

const server = new Server();
const db = new Database();

// Home page
server.get("/", async (req, res) => {
  const user = await db.auth.loggedInUser(req);
  return res.render("main", {
    user,
    locations: await db.locations.getAll(user.id),
    categories: await db.categories.getAll(),
  });
});

// Favorite management
server.get("/favorite", async (req, res) => {
  const user = await db.auth.loggedInUser(req);
  if (user) {
    return res.render("main", {
      user,
      locations: await db.locations.getFavorites(user.id),
      categories: await db.categories.getAll(),
      isFavoritePage: true,
    });
  }
  res.redirect("/");
});
server.post("/favorite", async (req, res) => {
  const user = await db.auth.loggedInUser(req);
  if (user) {
    await db.favorites.toggle(user.id, req.body.locationId);
  }
  // Redirect back to the previous page
  res.redirect(req.get("Referer") || "/");
});

// User management
server.post("/login", async (req, res) => {
  if (await db.auth.loginUser(req)) {
    res.redirect("/");
  } else {
    res.render("alert", { message: "Login failed!" });
  }
});
server.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Review location
server.post("/review", async (req, res) => {
  const user = await db.auth.loggedInUser(req);
  if (user) {
    await db.reviews.createOrUpdate(
      user.id,
      req.body.locationId,
      req.body.rating,
      req.body.comment
    );
  }
  // Redirect back to the previous page
  res.redirect(req.get("Referer") || "/");
});

// Create location
server.post("/create", async (req, res) => {
  if (await db.auth.loggedInUser(req)) {
    try {
      await db.locations.create(
        req.body.name,
        req.body.street,
        req.body.houseNumber,
        req.body.zipCode,
        req.body.place,
        req.body.country,
        req.body.categoryId
      );
    } catch ({ message }) {
      return res.render("alert", { message });
    }
  }
  // Redirect back to the previous page
  res.redirect(req.get("Referer") || "/");
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
server.listen(3010, () => {
  console.log(`🚀 M307 Dario & Chiara server running at http://localhost:3010`);
});
