import express from "express";
import userController from "../controllers/users.controller.js";
import shiftsController from "../controllers/shifts.controller.js";
import classesController from "../controllers/classes.controller.js";
import enrollmentsController from "../controllers/enrollments.controller.js";
import productsController from "../controllers/products.controller.js";
import cartController from "../controllers/cart.controller.js";
import comprasController from "../controllers/compras.controller.js";
import { authorization } from "../middlewares/auth.middlewares.js";
import mpController from "../controllers/mp.controller.js";

const route = express.Router();
import upload from "../config/multerConfig.cjs";
import authController from "../controllers/auth.controller.js";
const app = express();

//route.use(fileUpload());


route.get("/", (req, res) => {
  res.send("Candida Gres - Api");
});

route.all('/api/*', authorization)

// Auth
route.post("/api/auth/login", authController.login)
route.post("/api/auth/register", authController.register) // Documented
route.post("/api/auth/restorePassword", authController.restorePassword); // Documented
route.post("/api/auth/verifyEmailCode", authController.verifyEmailCode); // Documented
route.post("/api/auth/changePassword", authController.changePassword); // Documented
route.patch("/api/profile/:id", upload.single('file'), authController.updateProfile); // Documented
// route.post("/api/users/auth", userController.auth)


// Users
route.get("/api/usersAll", userController.find); // Documented, needs admin validation
route.get("/api/users", userController.findQuery); // Documented, needs admin validation
route.get("/api/users/:id", userController.findById); // Documented, needs admin validation
route.post("/api/users", userController.create); // Documented, needs admin validation
route.delete("/api/users/:id", userController.remove); // Documented, needs admin validation
route.patch("/api/users/:id", userController.update); // Documented, needs admin validation


// Products
route.get("/api/productsAll", productsController.find); // Documented, needs admin validation
route.get("/api/products", productsController.findQuery); // Documented, needs admin validation
route.get("/api/adminProducts", productsController.findOwn); // Documented, needs admin validation
route.get("/api/products/:id", productsController.findById); // Documented, needs admin validation
route.post("/api/products", upload.single('file'), productsController.create); // Documented, needs admin validation
route.patch("/api/products/:id", upload.single('file'), productsController.update); // Documented, needs admin validation
route.delete("/api/products/:id", productsController.remove); // Documented, needs admin validation


// Classes
route.get("/api/classesAll", classesController.find); // Documented, needs admin validation
route.get("/api/classes", classesController.findQuery); // Documented, needs admin validation
route.get("/api/adminClasses", classesController.findOwn); // Documented, needs admin validation
route.get("/api/classes/:id", classesController.findById); // Documented, needs admin validation
route.get("/api/classes/:id/shifts", classesController.findOneWithShifts); // Documented, needs admin validation
route.post("/api/classes", classesController.create); // Documented, needs admin validation
route.patch("/api/classes/:id", classesController.update); // Documented, needs admin validation
route.delete("/api/classes/:id", classesController.remove); // Documented, needs admin validation


// Shifts
route.get("/api/shiftsAll", shiftsController.find); // Documented, needs admin validation
route.get("/api/shifts", shiftsController.findQuery); // Documented, needs admin validation
route.get("/api/shifts/:id", shiftsController.findById); // Documented, needs admin validation
route.get("/api/shifts/:id/enrollments", shiftsController.findOneWithEnrollments); // Documented, needs admin validation
route.post("/api/shifts", shiftsController.create); // Documented, needs admin validation
route.patch("/api/shifts/:id", shiftsController.update); // Documented, needs admin validation
route.delete("/api/shifts/:id", shiftsController.remove); // Documented, needs admin validation


// Enrollments
route.get("/api/enrollmentsAll", enrollmentsController.find); // Documented, needs admin validation
route.get("/api/enrollments", enrollmentsController.findQuery); // Documented, needs admin validation
route.get("/api/enrollments/:id", enrollmentsController.findById); // Documented, needs admin validation
route.get("/api/enrollments/user/:id", enrollmentsController.findByUser); // Documented, needs admin validation
route.post("/api/enrollments", enrollmentsController.create); // Documented, needs admin validation
// route.patch("/api/enrollments/:id", enrollmentsController.update);
route.delete("/api/enrollments/:id", enrollmentsController.remove); // Documented, needs admin validation



// Carrito
route.get("/api/carrito", cartController.find);
route.get("/api/carrito/:id", cartController.findById);
route.get("/api/carrito/user/:id", cartController.findByIdUser);
// route.get("/api/carrito/user/finalizado/:idUser", cartController.findByIdUserFinalizado);
route.post("/api/carrito/carrito", cartController.create);
route.delete("/api/carrito/:idCarrito", cartController.remove);
route.patch("/api/carrito/:idCarrito", cartController.update);
// route.patch("/api/carrito/user/:idCarrito", cartController.updateEliminarProducto);
route.patch("/api/carrito/:idUser/addToCart", cartController.addToCart);
route.patch("/api/carrito/:idUser/substractToCart", cartController.substractToCart);


// Compras 
route.get("/api/compras", comprasController.find);
route.get("/api/compras/:id", comprasController.findById);
route.get("/api/compras/user/:idUser", comprasController.findManyByIdUser);
route.post("/api/compras/compra", comprasController.create);
route.delete("/api/compras/:id", comprasController.remove);
route.patch("/api/compras/:id", comprasController.update);


route.post("/api/create_preference", mpController.createPreference);
route.post("/api/webhook", mpController.receiveWebhook);




export default route;
