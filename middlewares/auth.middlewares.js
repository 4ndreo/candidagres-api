import jwt from "jsonwebtoken";

const whitelistedEndPoints = [
  "/api/users/login",
  "/api/users/user",
  "/api/cursos",
  "/api/create_preference"
];

const adminEndPoints = [
  // { uri: "/api/user", method: "GET" }, // FIXME: Arreglar que un usuario solo pueda ver la info de SU PROPIO USUARIO (TOKEN)
  { uri: "/api/user", method: "POST" },
  { uri: "/api/users/", method: "DELETE" },
  { uri: "/api/users/", method: "PATCH" },
  { uri: "/api/curso", method: "POST" },
  { uri: "/api/cursos/", method: "DELETE" },
  { uri: "/api/cursos/", method: "PATCH" },
  { uri: "/api/turno", method: "POST" },
  { uri: "/api/turnos/", method: "DELETE" },
  { uri: "/api/turnos/", method: "PATCH" },
  // { uri: "/api/inscripciones/", method: "DELETE" }, // FIXME: Arreglar que un usuario solo pueda eliminar una inscripción PARA SU PROPIO USUARIO (TOKEN)
  // { uri: "/api/inscripcion", method: "POST" }, // FIXME: Arreglar que un usuario solo pueda subir una inscripción PARA SU PROPIO USUARIO (TOKEN)
  // { uri: "/api/inscripciones/", method: "PATCH" },
  // { uri: "/api/locationRequests/", method: "PATCH", approved: true },
];

function authorization(req, res, next) {
  try {
    // Si url está en la whitelist, acceso a usuarios anónimos.
    if (whitelistedEndPoints.some((endpoint) => endpoint === req.url)) {
      next();
    } else {
      // Si no está en whitelist, verifico que esté logeado un usuario existente.
      const token = req.headers["auth-token"] || "";
      const user = jwt.verify(token, "FARG");
      if (
        // Verifico si url está en la lista de administrador.
        adminEndPoints.some(
          (endpoint) =>
            // {
            req.url.includes(endpoint.uri) && endpoint.method === req.method
          // }
        )
      ) {
        // Verifico que el usuario sea administrador.
        let admin = isAdmin(user);
        if (admin) {
          next();
        } else {
          res.status(401).json({
            mensaje: "Usuario no administrador",
          });
        }
      } else {
        req.user = user;
        next();
      }
    }
  } catch (err) {
    res.status(401).json({
      mensaje: "Sin Autorización",
    });
  }
}

function isAdmin(user) {
  let verifyAdmin = user.role === 1 ? true : false;
  return verifyAdmin;
}

// function isLocReqPatchApproved(endpoint, reqBody) {
//   let locReqApproved = false;
//   if (endpoint.uri === "/api/locationRequests/") {
//     locReqApproved = endpoint.approved === reqBody.approved;
//     return locReqApproved;
//   }
//   return false;
// }

//   if (true) {
//     next();
//   }
// }

export { authorization };
