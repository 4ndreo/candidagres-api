import express from "express";

const route = express.Router();
import upload from "../config/multerConfig.cjs";

import { authorization } from "../middlewares/auth.middlewares.js";
import { admin } from "../middlewares/admin.middlewares.js";

import authController from "../controllers/auth.controller.js";
import userController from "../controllers/users.controller.js";
import productsController from "../controllers/products.controller.js";
import classesController from "../controllers/classes.controller.js";
import shiftsController from "../controllers/shifts.controller.js";
import enrollmentsController from "../controllers/enrollments.controller.js";
import cartController from "../controllers/cart.controller.js";
import purchasesController from "../controllers/purchases.controller.js";
import mpController from "../controllers/mp.controller.js";

route.get("/", (req, res) => {
  res.send("Candida Gres - Api");
});

route.all('/api/*', authorization)


// Auth
route.post("/api/auth/login", authController.login)
route.post("/api/auth/register", authController.register)
route.post("/api/auth/restorePassword", authController.restorePassword);
route.post("/api/auth/verifyEmailCode", authController.verifyEmailCode);
route.post("/api/auth/changePassword", authController.changePassword);
route.patch("/api/profile/:id", upload.single('file'), authController.updateProfile);


// Users
route.get("/api/usersAll", userController.find);
route.get("/api/users", userController.findQuery);
route.get("/api/users/:id", admin, userController.findById);
route.post("/api/users", admin, userController.create);
route.patch("/api/users/:id", admin, userController.update);
route.delete("/api/users/:id", admin, userController.remove);


// Products
route.get("/api/productsAll", productsController.find);
route.get("/api/products", productsController.findQuery);
route.get("/api/products/:id", productsController.findById);
route.get("/api/adminProducts", admin, productsController.findOwn);
route.post("/api/products", admin, upload.single('file'), productsController.create);
route.patch("/api/products/:id", admin, upload.single('file'), productsController.update);
route.delete("/api/products/:id", admin, productsController.remove);


// Classes
route.get("/api/classesAll", classesController.find);
route.get("/api/classes", classesController.findQuery);
route.get("/api/classes/:id", classesController.findById);
route.get("/api/classes/:id/shifts", classesController.findOneWithShifts);
route.get("/api/adminClasses", admin, classesController.findOwn);
route.post("/api/classes", admin, classesController.create);
route.patch("/api/classes/:id", admin, classesController.update);
route.delete("/api/classes/:id", admin, classesController.remove);


// Shifts
route.get("/api/shiftsAll", shiftsController.find);
route.get("/api/shifts", admin, shiftsController.findQuery);
route.get("/api/shifts/:id", shiftsController.findById);
// route.get("/api/shifts/:id/enrollments", shiftsController.findOneWithEnrollments); // Removed because is not in use
route.post("/api/shifts", admin, shiftsController.create);
route.patch("/api/shifts/:id", admin, shiftsController.update);
route.delete("/api/shifts/:id", admin, shiftsController.remove);


// Enrollments
route.get("/api/enrollmentsAll", enrollmentsController.find);
route.get("/api/enrollments", admin, enrollmentsController.findQuery);
route.get("/api/enrollments/own", enrollmentsController.findOwn); // TODO: Document
route.get("/api/enrollments/:id", enrollmentsController.findById);
route.get("/api/enrollments/user/:id", admin, enrollmentsController.findByUser);
route.post("/api/enrollments", enrollmentsController.create);
route.delete("/api/enrollments/:id", enrollmentsController.remove);
// route.patch("/api/enrollments/:id", enrollmentsController.update); // Removed because is not in use


// Carts
route.get("/api/carts", admin, cartController.find);
route.get("/api/carts/:id", admin, cartController.findById);
route.get("/api/carts/user/:id", cartController.findByUser);
route.post("/api/carts", admin, cartController.create);
route.patch("/api/carts/:id", admin, cartController.update);
route.patch("/api/carts/:id/addToCart", cartController.addToCart);
route.patch("/api/carts/:id/substractToCart", cartController.substractToCart);
route.delete("/api/carts/:id", admin, cartController.remove);


// Purchases 
route.get("/api/purchasesAll", admin, purchasesController.find);
route.get("/api/purchases", admin, purchasesController.findQuery);
route.get("/api/purchases/:id", admin, purchasesController.findById);
route.get("/api/purchases/user/:id", purchasesController.findManyByIdUser);
route.patch("/api/purchases/:id/deliver", admin, purchasesController.setDelivered); // Commented because is not in use, purchases shouldn't be updated
// route.post("/api/purchases", purchasesController.create); // Removed because is not in use
// route.patch("/api/purchases/:id", purchasesController.update); // Commented because is not in use, purchases shouldn't be updated
// route.delete("/api/purchases/:id", purchasesController.remove); // Commented because is not in use, purchases shouldn't be deleted


// Mercado Pago
route.post("/api/create_preference", mpController.createPreference);
route.post("/api/webhook", mpController.receiveWebhook); // Only used for MercadoPago's internal logic, not documented


export default route;
