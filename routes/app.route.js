import express from "express";
import locationController from "../controllers/locations.controller.js";
import locationRequestController from "../controllers/locationRequests.controller.js";
import categoryController from "../controllers/categories.controller.js";
import userController from "../controllers/users.controller.js";
import roleController from "../controllers/roles.controller.js";
import iconController from "../controllers/icons.controller.js";
import favoriteController from "../controllers/favorites.controller.js";
import { authorization } from "../middlewares/auth.middlewares.js";

const route = express.Router();

route.get("/", (req, res) => {
  res.send("Parcial Roni, Flor y Fran");
});

route.all('/api/*', authorization)

// Locations
route.get("/api/locations", locationController.find);
route.get("/api/locations/id-:idLocation", locationController.findById);
route.get("/api/locations/city-:city", locationController.findByCity);
route.post("/api/locations/location", locationController.create);
route.delete("/api/locations/:idLocation", locationController.remove);
route.patch("/api/locations/:idLocation", locationController.update);

// Location Requests
route.get("/api/locationRequests", locationRequestController.find);
route.get("/api/locationRequests/id-:idLocationRequest", locationRequestController.findById);
route.get("/api/locationRequests/user-:idLocationRequestUser", locationRequestController.findByUser);
route.post("/api/locationRequests/locationRequest", locationRequestController.create);
route.delete("/api/locationRequests/:idLocationRequest", locationRequestController.remove);
route.patch("/api/locationRequests/:idLocationRequest", locationRequestController.update);

// Categories
route.get("/api/categories", categoryController.find);
route.get("/api/categories/:idCategory", categoryController.findById);
route.post("/api/categories/category", categoryController.create);
route.delete("/api/categories/:idCategory", categoryController.remove);
route.patch("/api/categories/:idCategory", categoryController.update);

// Users
route.get("/api/users", userController.find);
route.get("/api/users/:idUser", userController.findById);
route.post("/api/users/user", userController.create);
route.delete("/api/users/:idUser", userController.remove);
route.patch("/api/users/:idUser", userController.update);
route.post("/api/users/login", userController.login)
route.post("/api/users/auth", userController.auth)

// Roles
route.get("/api/roles", roleController.find);
route.get("/api/roles/:idRole", roleController.findById);
route.post("/api/roles/role", roleController.create);
route.delete("/api/roles/:idRole", roleController.remove);
route.patch("/api/roles/:idRole", roleController.update);

// Icons
route.get("/api/icons", iconController.find);
route.get("/api/icons/:idIcon", iconController.findById);
route.post("/api/icons/icon", iconController.create);
route.delete("/api/icons/:idIcon", iconController.remove);
route.patch("/api/icons/:idIcon", iconController.update);

// Favorites
route.get("/api/favorites", favoriteController.find);
route.post("/api/favorites/:locationid", favoriteController.create);
route.delete("/api/favorites/:idFavorite", favoriteController.remove);


export default route;
