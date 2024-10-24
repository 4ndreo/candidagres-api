import jwt from "jsonwebtoken";
import * as UserService from "../services/users.service.js";
import bcrypt from 'bcrypt'
import { validateCUIL, validateDNI, validateDate, validateEmail, validatePassport, validatePassword } from "../utils/validators.js";

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

  UserService.findById(userId)
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function create(req, res) {
  const user = req.body;
  const newErrors = {};

  if (user.first_name?.length <= 0 || !user.first_name) newErrors.first_name = 'Debe completar el nombre.';
  if (user.last_name?.length <= 0 || !user.last_name) newErrors.last_name = 'Debe completar el apellido.';
  if (validateDate(user.birth_date)) newErrors.birth_date = validateDate(user.birth_date)

  switch (user.document_type) {
    case 'DNI':
      if (validateDNI(user.id_document)) newErrors.id_document = validateDNI(user.id_document)
      break;
    case 'CUIL':
      if (validateCUIL(user.id_document)) newErrors.id_document = validateCUIL(user.id_document)
      break;
    case 'Pasaporte':
      if (validatePassport(user.id_document)) newErrors.id_document = validatePassport(user.id_document)
      break;
    default:
      newErrors.document_type = 'Debe ingresar un tipo de documento válido.'
  }

  if (validateEmail(user.email)) newErrors.email = validateEmail(user.email);
  if (validatePassword(user.password)) newErrors.password = validatePassword(user.password);

  const userOld = await UserService.findOneByEmail(user.email)
  const idDocumentOld = await UserService.findOneByIdDocument(user.id_document)

  if (userOld) newErrors.email = 'El usuario ya existe.'
  if (idDocumentOld) newErrors.id_document = 'Ya existe un usuario con ese documento.'

  if (Object.keys(newErrors).length !== 0) {
    return res.status(400).json({ err: newErrors });
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
  const newErrors = {};


  if (validateEmail(user.email)) newErrors.email = validateEmail(user.email);
  if (validatePassword(user.password)) newErrors.password = validatePassword(user.password);

  if (Object.keys(newErrors).length !== 0) {
    return res.status(400).json({ err: newErrors });
  }

  UserService.login(user)
    .then((userData) => {
      const token = jwt.sign({ id: userData._id, email: userData.email, role: userData.role }, process.env.JWT_SECRET);
      res.status(200).json({ userData, token });
    })
    .catch((err) => {
      res.status(500).json({ err: {password: err.message} });
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
