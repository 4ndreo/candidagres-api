import express from "express";
import fileUpload from "express-fileupload";
import userController from "../controllers/users.controller.js";
import shiftsController from "../controllers/shifts.controller.js";
import classesController from "../controllers/classes.controller.js";
import inscripcionesController from "../controllers/inscripciones.controller.js";
import productosController from "../controllers/productos.controller.js";
import carritoController from "../controllers/carrito.controller.js";
import comprasController from "../controllers/compras.controller.js";
import { authorization } from "../middlewares/auth.middlewares.js";
import { isAllBooked, verifyDeletionPatch } from "../middlewares/inscripciones.middlewares.js";
import multer from 'multer';
import bodyParser from "express";
import mediaController from "../controllers/media.controller.js";
import mpController from "../controllers/mp.controller.js";

const route = express.Router();
const upload = multer({ dest: 'uploads/' });
const app = express();

//route.use(fileUpload());


route.get("/", (req, res) => {
  res.send("Candida Gres - Web");
});

route.all('/api/*', authorization)

// Users
route.get("/api/users", userController.find);
route.get("/api/users/:idUser", userController.findById);
route.post("/api/users/user", userController.create);
route.delete("/api/users/:idUser", userController.remove);
route.patch("/api/users/:idUser", userController.update);
route.post("/api/users/login", userController.login)
route.post("/api/users/auth", userController.auth)

// Profile
route.patch("/api/profile/:id", userController.updateProfile);

// Turnos

route.get("/api/shiftsAll", shiftsController.find);
route.get("/api/shifts", shiftsController.findQuery);
route.get("/api/shifts/:id", shiftsController.findById);
// route.get("/api/shifts/curso/:idCurso", shiftsController.findByCurso);
route.post("/api/shifts", shiftsController.create);
route.delete("/api/shifts/:id", shiftsController.remove);
route.patch("/api/shifts/:id", shiftsController.update);


// Cursos
route.get("/api/classesAll", productosController.find);
route.get("/api/classes", classesController.findQuery);
route.get("/api/classes/:id", classesController.findById);
route.get("/api/classes/:id/shifts", classesController.findOneWithShifts);
route.post("/api/classes", classesController.create);
route.delete("/api/classes/:id", classesController.remove);
route.patch("/api/classes/:id", classesController.update);


// Inscripciones
route.get("/api/inscripciones", inscripcionesController.find);
route.get("/api/inscripciones/:idInscripciones", inscripcionesController.findById);
route.get("/api/inscripciones/user/:idUser", inscripcionesController.findByUser);
route.get("/api/inscripcionesAll/user/:idUser", inscripcionesController.findAllByUser);
route.get("/api/inscripcionesAll/user/:idUser/turno/:idTurno", inscripcionesController.findAllByUserAndTurno);
route.post("/api/inscripciones/inscripcion", isAllBooked, inscripcionesController.create);
route.delete("/api/inscripciones/:idInscripciones", inscripcionesController.remove);
route.patch("/api/inscripciones/:idInscripciones", verifyDeletionPatch, inscripcionesController.update);
route.get("/api/inscripcionesByCurso/:idCurso", inscripcionesController.countInscripcionesByCurso);


// Productos
route.get("/api/productsAll", productosController.find);
route.get("/api/products", productosController.findQuery);
route.get("/api/products/:idProductos", productosController.findById);
route.post("/api/products", productosController.create);
route.delete("/api/products/:idProductos", productosController.remove);
route.patch("/api/products/:idProductos", productosController.update);

route.post("/api/media", upload.single('imagenProducto'), mediaController.uploadImagen);
route.delete("/api/media/:name", mediaController.removeImage);





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
