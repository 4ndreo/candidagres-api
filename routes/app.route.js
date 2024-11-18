import express from "express";
import userController from "../controllers/users.controller.js";
import shiftsController from "../controllers/shifts.controller.js";
import classesController from "../controllers/classes.controller.js";
import enrollmentsController from "../controllers/enrollments.controller.js";
import productosController from "../controllers/productos.controller.js";
import carritoController from "../controllers/carrito.controller.js";
import comprasController from "../controllers/compras.controller.js";
import { authorization } from "../middlewares/auth.middlewares.js";
import { isAllBooked } from "../middlewares/inscripciones.middlewares.js";
import mpController from "../controllers/mp.controller.js";

const route = express.Router();
import upload from "../config/multerConfig.cjs";
const app = express();

//route.use(fileUpload());


route.get("/", (req, res) => {
  res.send("Candida Gres - Web");
});

route.all('/api/*', authorization)

// Users
route.get("/api/users", userController.find);
route.get("/api/users/:idUser", userController.findById);
route.post("/api/users", userController.create);
route.delete("/api/users/:idUser", userController.remove);
route.patch("/api/users/:idUser", userController.update);
route.post("/api/users/login", userController.login)
route.post("/api/users/auth", userController.auth)


// Profile
route.patch("/api/profile/:id", upload.single('file'), userController.updateProfile);
route.post("/api/auth/restorePassword", userController.restorePassword);
route.post("/api/auth/verifyEmailCode", userController.verifyEmailCode);
route.post("/api/auth/changePassword", userController.changePassword);


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
// route.get("/api/enrollmentsAll/user/:idUser", enrollmentsController.findAllByUser);
// route.get("/api/enrollmentsAll/user/:idUser/turno/:idTurno", enrollmentsController.findAllByUserAndTurno);
route.post("/api/enrollments", isAllBooked, enrollmentsController.create);
route.delete("/api/enrollments/:id", enrollmentsController.remove);
route.patch("/api/enrollments/:id", enrollmentsController.update);
// route.patch("/api/enrollments/:idEnrollments", verifyDeletionPatch, enrollmentsController.update);
route.get("/api/enrollmentsByCurso/:idCurso", enrollmentsController.countEnrollmentsByCurso);


// Productos
route.get("/api/productsAll", productosController.find);
route.get("/api/products", productosController.findQuery);
route.get("/api/products/:idProductos", productosController.findById);
route.post("/api/products", upload.single('file'), productosController.create);
route.delete("/api/products/:idProductos", productosController.remove);
route.patch("/api/products/:idProductos", upload.single('file'), productosController.update);


// Carrito
route.get("/api/carrito", carritoController.find);
route.get("/api/carrito/:idCarrito", carritoController.findById);
route.get("/api/carrito/user/:idUser", carritoController.findByIdUser);
route.get("/api/carrito/user/finalizado/:idUser", carritoController.findByIdUserFinalizado);
route.post("/api/carrito/carrito", carritoController.create);
route.delete("/api/carrito/:idCarrito", carritoController.remove);
route.patch("/api/carrito/:idCarrito", carritoController.update);
route.patch("/api/carrito/user/:idCarrito", carritoController.updateEliminarProducto);
route.patch("/api/carrito/:idUser/addToCart", carritoController.addToCart);
route.patch("/api/carrito/:idUser/substractToCart", carritoController.substractToCart);


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
