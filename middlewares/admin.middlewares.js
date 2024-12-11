import jwt from "jsonwebtoken";

function admin(req, res, next) {
  try {
    const token = req.headers["auth-token"] || "";
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const admin = isAdmin(user);
    if (admin) {
      return next();
    } else {
      return res.status(403).json({
        message: "Usuario no administrador",
      });
    }
  } catch (err) {
    res.status(401).json({
      err,
      message: "Sin Autorización",
    });
  }
}

function isAdmin(user) {
  let verifyAdmin = user.role === 1 ? true : false;
  return verifyAdmin;
}

export { admin };
