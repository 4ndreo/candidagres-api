import jwt from "jsonwebtoken";

const whitelistedEndPoints = [
  { uri: "/api/create_preference", method: "POST" },
  { uri: "/api/webhook", method: "POST" },
  { uri: "/api/auth/login", method: "POST" },
  { uri: "/api/auth/register", method: "POST" },
  { uri: "/api/auth/restorePassword", method: "POST" },
  { uri: "/api/auth/verifyEmailCode", method: "POST" },
  { uri: "/api/auth/changePassword", method: "POST" },

];

//TODO: Agregar endpoints nuevos
const adminEndPoints = [
  { uri: "/api/users", method: "GET" }, // FIXME: Arreglar que un usuario solo pueda ver la info de SU PROPIO USUARIO (TOKEN)
  { uri: "/api/users", method: "POST" },
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
    // console.log("adminEndPoints", req._parsedUrl.pathname);

    if (whitelistedEndPoints.some((endpoint) => req._parsedUrl.pathname.includes(endpoint.uri) && endpoint.method === req.method /*endpoint === req._parsedUrl.pathname*/)) {
      next();
    } else {
      // Si no está en whitelist, verifico que esté logeado un usuario existente.
      const token = req.headers["auth-token"] || "";
      const user = jwt.verify(token, process.env.JWT_SECRET);

      // Verifico si url está en la lista de vendedor.
      // if (sellerEndPoints.some((endpoint) => req._parsedUrl.pathname.includes(endpoint.uri) && endpoint.method === req.method)) {
      //   // Verifico que el usuario sea vendedor o administrador.
      //   let seller = isSeller(user);
      //   if (seller) {
      //     return next();
      //   } else {
      //     return res.status(401).json({
      //       message: "Usuario no vendedor",
      //     });
      //   }
      // }

      // Verifico si url está en la lista de administrador.
      // console.log("adminEndPoints", adminEndPoints, req._parsedUrl.pathname);
      // console.log("adminEndPoints", adminEndPoints.some((endpoint) => req._parsedUrl.pathname.includes(endpoint.uri), endpoint.method === req.method));
      if (adminEndPoints.some((endpoint) => req._parsedUrl.pathname.includes(endpoint.uri) && endpoint.method === req.method)) {
        // Verifico que el usuario sea administrador.
        let admin = isAdmin(user);
        if (admin) {
          return next();
        } else {
          return res.status(403).json({
            message: "Usuario no administrador",
          });
        }
      }
      req.user = user;
      return next();

    }
  } catch (err) {
    res.status(401).json({
      err: true,
      message: "Sin Autorización",
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
