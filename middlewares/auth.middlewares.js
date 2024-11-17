import jwt from "jsonwebtoken";

const whitelistedEndPoints = [
  "/api/users/login",
  "/api/users",
  "/api/classesAll",
  "/api/create_preference",
  "/api/webhook",
];

const sellerEndPoints = [
  // { uri: "/api/user", method: "GET" }, // FIXME: Arreglar que un usuario solo pueda ver la info de SU PROPIO USUARIO (TOKEN)
  { uri: "/api/products", method: "GET" },
  { uri: "/api/products", method: "POST" },
  { uri: "/api/products", method: "PATCH" },
  { uri: "/api/products", method: "DELETE" },
  // { uri: "/api/inscripciones/", method: "DELETE" }, // FIXME: Arreglar que un usuario solo pueda eliminar una inscripción PARA SU PROPIO USUARIO (TOKEN)
  // { uri: "/api/inscripcion", method: "POST" }, // FIXME: Arreglar que un usuario solo pueda subir una inscripción PARA SU PROPIO USUARIO (TOKEN)
  // { uri: "/api/inscripciones/", method: "PATCH" },
  // { uri: "/api/locationRequests/", method: "PATCH", approved: true },
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
    if (whitelistedEndPoints.some((endpoint) => req.url.includes(endpoint) /*endpoint === req.url*/)) {
      next();
    } else {
      // Si no está en whitelist, verifico que esté logeado un usuario existente.
      const token = req.headers["auth-token"] || "";
      const user = jwt.verify(token, process.env.JWT_SECRET);

      // Verifico si url está en la lista de vendedor.
      if (sellerEndPoints.some((endpoint) => req.url.includes(endpoint.uri) && endpoint.method === req.method)) {
        // Verifico que el usuario sea vendedor o administrador.
        let seller = isSeller(user);
        if (seller) {
          return next();
        } else {
          return res.status(401).json({
            mensaje: "Usuario no vendedor",
          });
        }
      }

      // Verifico si url está en la lista de administrador.
      if (adminEndPoints.some((endpoint) => req.url.includes(endpoint.uri) && endpoint.method === req.method)) {
        // Verifico que el usuario sea administrador.
        let admin = isAdmin(user);
        if (admin) {
          return next();
        } else {
          return res.status(401).json({
            mensaje: "Usuario no administrador",
          });
        }
      }
      req.user = user;
      return next();

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

function isSeller(user) {
  let verifySeller = user.role <= 2 ? true : false;
  return verifySeller;
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
