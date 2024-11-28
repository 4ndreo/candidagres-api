import express from "express";
import userController from "../controllers/users.controller.js";
import shiftsController from "../controllers/shifts.controller.js";
import classesController from "../controllers/classes.controller.js";
import enrollmentsController from "../controllers/enrollments.controller.js";
import productosController from "../controllers/productos.controller.js";
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

// Users
route.get("/api/usersAll", userController.find); // Documented, needs admin validation
route.get("/api/users", userController.findQuery); // Documented, needs admin validation
route.get("/api/users/:id", userController.findById); // Documented, needs admin validation
route.post("/api/users", userController.create); // Documented, needs admin validation
route.delete("/api/users/:id", userController.remove); // Documented, needs admin validation
route.patch("/api/users/:id", userController.update); // Documented, needs admin validation
// route.post("/api/users/auth", userController.auth)


// Auth
route.post("/api/auth/login", authController.login)
route.post("/api/auth/register", authController.register) // Documented
route.post("/api/auth/restorePassword", authController.restorePassword);
route.post("/api/auth/verifyEmailCode", authController.verifyEmailCode);
route.post("/api/auth/changePassword", authController.changePassword);
route.patch("/api/profile/:id", upload.single('file'), authController.updateProfile); // Documented


// Shifts
route.get("/api/shiftsAll", shiftsController.find);
route.get("/api/shifts", shiftsController.findQuery);
route.get("/api/shifts/:id/enrollments", shiftsController.findOneWithEnrollments);
route.get("/api/shifts/:id", shiftsController.findById);
route.post("/api/shifts", shiftsController.create);
route.delete("/api/shifts/:id", shiftsController.remove);
route.patch("/api/shifts/:id", shiftsController.update);


// Classes
route.get("/api/classesAll", classesController.find);
route.get("/api/classes", classesController.findQuery);
route.get("/api/adminClasses", classesController.findOwn);
route.get("/api/classes/:id", classesController.findById);
route.get("/api/classes/:id/shifts", classesController.findOneWithShifts);
route.post("/api/classes", classesController.create);
route.delete("/api/classes/:id", classesController.remove);
route.patch("/api/classes/:id", classesController.update);


// Enrollments
route.get("/api/enrollmentsAll", enrollmentsController.find);
route.get("/api/enrollments", enrollmentsController.findQuery);
route.get("/api/enrollments/:id", enrollmentsController.findById);
route.get("/api/enrollments/user/:idUser", enrollmentsController.findByUser);
route.post("/api/enrollments", enrollmentsController.create);
route.delete("/api/enrollments/:id", enrollmentsController.remove);
route.patch("/api/enrollments/:id", enrollmentsController.update);
route.get("/api/enrollmentsByCurso/:idCurso", enrollmentsController.countEnrollmentsByCurso);


// Productos
route.get("/api/productsAll", productosController.find);
route.get("/api/products", productosController.findQuery);
route.get("/api/adminProducts", productosController.findOwn);
route.get("/api/products/:id", productosController.findById);
route.post("/api/products", upload.single('file'), productosController.create);
route.delete("/api/products/:idProductos", productosController.remove);
route.patch("/api/products/:idProductos", upload.single('file'), productosController.update);


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
