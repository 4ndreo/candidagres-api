import jwt from "jsonwebtoken";

const endpoint = { uri: "/api/inscripciones/", method: "PATCH" }

function verifyDeletionPatch(req, res, next) {
  const bodyKeys = Object.keys(req.body);
  const token = req.headers["auth-token"] || "";
  const user = jwt.verify(token, "FARG");
  let admin = isAdmin(user);
  try {
    if (admin) {
      next();
    } else {

      // Verificar que sea una solicitud PATCH
      if (req.method === endpoint.method && req.url.includes(endpoint.uri)) {
        // Verificar que solo tenga la propiedad "deleted" en el cuerpo
        if (bodyKeys.length === 1 && bodyKeys[0] === "deleted") {
          next();
        } else {
          res.status(403).json({ mensaje: "Acción no permitida" });
        }
      } else {
        res.status(401).json({
          mensaje: "Sin Autorización"
        });
      }
    }
  } catch (err) {
    res.status(401).json({ mensaje: "Sin Autorización" });
  }
}

function isAdmin(user) {
  let verifyAdmin = user.role === 1 ? true : false;
  return verifyAdmin;
}

export { verifyDeletionPatch };
