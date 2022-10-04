import jwt from "jsonwebtoken";

const whitelistedEndPoints = ["/api/users/login", "/api/users/user"];

const adminEndPoints = [
  
  { uri: "/api/user", method: "POST" },
  { uri: "/api/users/", method: "DELETE" },
  { uri: "/api/users/", method: "PATCH" },
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
      const user = jwt.verify(token, "FFR");
      if (
        // Verifico si url está en la lista de administrador.
        adminEndPoints.some((endpoint) => 
        // {
          req.url.includes(endpoint.uri)
           &&
          endpoint.method === req.method 
          &&
          (req.body.approved  === undefined ? true : req.body.approved)
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
