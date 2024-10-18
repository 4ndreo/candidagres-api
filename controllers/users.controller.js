import jwt from "jsonwebtoken";
import * as UserService from "../services/users.service.js";
import bcrypt from 'bcrypt'
import { validateCUIL, validateDNI, validateEmail, validatePassport, validatePassword } from "../utils/validators.js";

async function find(req, res) {
  UserService.find()
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function findById(req, res) {
  const userId = req.params.idUser;

  UserService.findUserById(userId)
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function create(req, res) {
  let error = null;
  error = req.body ? error : 'Todos los campos son obligatorios.'

  const user = req.body;

  error = validatePassword(user.password) ?? error
  error = validateEmail(user.email) ?? error

  switch (user.documentType) {
    case 'DNI':
      error = validateDNI(user.idDocument) ?? error
      break;
    case 'CUIL':
      error = validateCUIL(user.idDocument) ?? error
      break;
    case 'Pasaporte':
      error = validatePassport(user.idDocument) ?? error
      break;
    default:
      error = 'Debe ingresar un tipo de documento válido.' ?? error
  }

  error = user.lastName?.length > 0 ? error : 'Debe completar el apellido'
  error = user.firstName?.length > 0 ? error : 'Debe completar el nombre'

  const userOld = await UserService.findOneByEmail(user.email)

  if (userOld) {
    error = 'El usuario ya existe.' ?? error
  }

  if (error) {
    return res.status(400).json({ err: error });
  }

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(user.password, salt)
  const newUser = {
    ...user, role: 2, password: passwordHash
  }
  await UserService.create(newUser)
    .then(function (user) {
      res.status(201).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });

}

async function remove(req, res) {
  const userId = req.params.idUser;

  UserService.remove(userId)
    .then(function (user) {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: `El alumno con id ${user} no existe` });
      }
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function update(req, res) {
  const userId = req.params.idUser;
  const data = req.body;

  UserService.update(userId, data)
    .then(function (user) {
      res.status(201).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function updateProfile(req, res) {
  const idUser = req.params.id;
  const data = req.body;
  const incomingToken = req.headers["auth-token"];
  const user = jwt.verify(incomingToken, process.env.JWT_SECRET);

  if (idUser !== user.id) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  UserService.update(user.id, data)
    .then(function (user) {
      res.status(201).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function login(req, res) {
  const user = req.body;
  let error = null;

  error = validateEmail(user.email)

  if (error) {
    return res.status(400).json({ err: error });
  }

  UserService.login(user)
    .then((userData) => {
      const token = jwt.sign({ id: userData._id, email: userData.email, role: userData.role }, process.env.JWT_SECRET);
      res.status(200).json({ userData, token });
    })
    .catch((err) => {
      res.status(500).json({ err: err.message });
    });
}

async function auth(req, res) {
  const incomingToken = req.headers["auth-token"];
  const user = req.body;
  UserService.auth(user)
    .then((userData) => {
      const token = jwt.sign(
        { id: userData._id, email: userData.email, role: userData.role }, process.env.JWT_SECRET);
      //res.header('auth-token', token).status(200).json(user);
      const userVerify1 = jwt.verify(incomingToken, process.env.JWT_SECRET);
      const userVerify2 = jwt.verify(token, process.env.JWT_SECRET);
      if (
        userVerify1.email === userVerify2.email &&
        userVerify1.role === userVerify2.role
      ) {
        res.status(200).json(userData);
      } else {
        const err = "No encontrado";
        res.status(404).json({ err });
      }
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

export default {
  find,
  findById,
  create,
  remove,
  update,
  updateProfile,
  login,
  auth,
};
