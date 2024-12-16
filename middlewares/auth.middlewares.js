import jwt from "jsonwebtoken";

const whitelistedEndPoints = [
  { uri: "/api/create_preference", method: "POST" },
  { uri: "/api/webhook", method: "POST" },
  { uri: "/api/auth/login", method: "POST" },
  { uri: "/api/auth/register", method: "POST" },
  { uri: "/api/auth/restorePassword", method: "POST" },
  { uri: "/api/auth/verifyEmailCode", method: "POST" },
  { uri: "/api/auth/changePassword", method: "POST" },
  { uri: "/api/openClassEnrollments", method: "POST" },

];



function authorization(req, res, next) {
  try {
    // Si url está en la whitelist, acceso a usuarios anónimos.
    if (whitelistedEndPoints.some((endpoint) => req._parsedUrl.pathname.includes(endpoint.uri) && endpoint.method === req.method)) {
      next();
    } else {

      // Si no está en whitelist, verifico que esté logeado un usuario existente.
      const token = req.headers["auth-token"] || "";
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return next();

    }
  } catch (err) {
    res.status(401).json({
      err,
      message: "Sin Autorización",
    });
  }
}

export { authorization };
