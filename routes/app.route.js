import express from "express";
import userController from "../controllers/users.controller.js";
import turnosController from "../controllers/turnos.controller.js";
import { authorization } from "../middlewares/auth.middlewares.js";

const route = express.Router();

route.get("/", (req, res) => {
  res.send("Candida Gres - Web");
});

//route.all('/api/*', authorization)

// Users
route.get("/api/users", userController.find);
route.get("/api/users/:idUser", userController.findById);
route.post("/api/users/user", userController.create);
route.delete("/api/users/:idUser", userController.remove);
route.patch("/api/users/:idUser", userController.update);
route.post("/api/users/login", userController.login)
route.post("/api/users/auth", userController.auth)


// Turnos
route.get("/api/turnos", turnosController.find);
route.get("/api/turnos/:idTurnos", turnosController.findById);
route.post("/api/turnos/turno", turnosController.create);
route.delete("/api/turnos/:idTurnos", turnosController.remove);
route.patch("/api/turnos/:idTurnos", turnosController.update);
// route.post("/api/turnos/login", turnosController.login)
// route.post("/api/turnos/auth", turnosController.auth)



export default route;
