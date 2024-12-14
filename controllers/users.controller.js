import jwt from "jsonwebtoken";
import * as UserService from "../services/users.service.js";
import bcrypt from 'bcrypt'
import { validateCUIL, validateDNI, validateDate, validateEmail, validateImage, validatePassport, validatePassword, validateRole, validateVerificationCode } from "../utils/validators.js";
import * as usersService from "../services/users.service.js";
import { ObjectId } from "mongodb";

async function find(req, res) {
  UserService.find()
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function findQuery(req, res) {
  const incomingToken = req.headers["auth-token"];
  const user = jwt.verify(incomingToken, process.env.JWT_SECRET);

  usersService.findQuery(req.query)
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function findById(req, res) {
  const userId = req.params.id;

  UserService.findById(userId)
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function create(req, res) {
  const user = { ...req.body, role: Number(req.body.role) };
  const newErrors = {};
  const allowedFields = [
    "first_name",
    "last_name",
    "document_type",
    "id_document",
    "email",
    "password",
    "birth_date",
    "role",
  ];

  Object.keys(user).forEach((field) => {
    if (!allowedFields.includes(field)) {
      delete user[field];
    }
  })

  if (user.first_name?.length <= 0 || !user.first_name) newErrors.first_name = 'Debe completar el nombre.';
  if (user.last_name?.length <= 0 || !user.last_name) newErrors.last_name = 'Debe completar el apellido.';
  if (validateDate(user.birth_date)) newErrors.birth_date = validateDate(user.birth_date)
  if (validateRole(user.role)) newErrors.role = validateRole(user.role)

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
    ...user, password: passwordHash
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
  const userId = req.params.id;

  UserService.remove(userId)
    .then(function (user) {
      if (user) {
        res.status(200).json({ message: `El usuario con id ${userId} se ha eliminado` });
      } else {
        res.status(404).json({ message: `El usuario con id ${userId} no existe` });
      }
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function update(req, res) {
  const idUser = req.params.id;
  const data = req.body;
  const oldUser = await usersService.findById(new ObjectId(idUser))

  const allowedFields = [
    "first_name",
    "last_name",
    "document_type",
    "id_document",
    "birth_date",
    "role",
  ];

  Object.keys(data).forEach((field) => {
    if (!allowedFields.includes(field)) {
      delete data[field];
    }
  })

  // Format
  if (typeof data.first_name !== 'undefined') data.first_name = String(req.body.first_name);
  if (typeof data.last_name !== 'undefined') data.last_name = String(req.body.last_name);
  if (typeof data.birth_date !== 'undefined') data.birth_date = String(req.body.birth_date);
  if (typeof data.document_type !== 'undefined') data.document_type = String(req.body.document_type);
  if (typeof data.id_document !== 'undefined') data.id_document = String(req.body.id_document);
  if (typeof data.role !== 'undefined') data.role = Number(req.body.role);

  // Validate

  const newErrors = {};

  if (typeof data.first_name !== 'undefined' && data.first_name?.length <= 0) newErrors.first_name = 'Debe completar el nombre.';
  if (typeof data.last_name !== 'undefined' && data.last_name?.length <= 0) newErrors.last_name = 'Debe completar el apellido.';
  if (typeof data.birth_date !== 'undefined' && validateDate(data.birth_date)) newErrors.birth_date = validateDate(data.birth_date)
  if (typeof data.role !== 'undefined' && validateRole(data.role)) newErrors.role = validateRole(data.role)

  switch (data.document_type ?? oldUser.document_type) {
    case 'DNI':
      if (validateDNI(data.id_document ?? oldUser.id_document)) newErrors.id_document = validateDNI(data.id_document ?? oldUser.id_document)
      break;
    case 'CUIL':
      if (validateCUIL(data.id_document ?? oldUser.id_document)) newErrors.id_document = validateCUIL(data.id_document ?? oldUser.id_document)
      break;
    case 'Pasaporte':
      if (validatePassport(data.id_document ?? oldUser.id_document)) newErrors.id_document = validatePassport(data.id_document ?? oldUser.id_document)
      break;
    default:
      if (typeof data.document_type !== 'undefined' && data.document_type?.length <= 0) newErrors.document_type = 'Debe ingresar un tipo de documento válido.'
  }

  if (typeof data.email !== 'undefined' && validateEmail(data.email)) newErrors.email = validateEmail(data.email);

  const idDocumentOld = await UserService.findOneByIdDocument(data.id_document)

  if (idDocumentOld) newErrors.id_document = 'Ya existe un usuario con ese documento.'

  if (Object.keys(newErrors).length !== 0) {
    return res.status(400).json({ err: newErrors });
  }

  if (Object.keys(newErrors).length !== 0) {
    return res.status(400).json({ err: newErrors });
  }
  UserService.update(idUser, data)
    .then(function (user) {
      res.status(201).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
  // const userId = req.params.idUser;
  // const data = req.body;

  // UserService.update(userId, data)
  //   .then(function (user) {
  //     res.status(201).json(user);
  //   })
  //   .catch(function (err) {
  //     res.status(500).json({ err });
  //   });
}

export default {
  find,
  findQuery,
  findById,
  create,
  remove,
  update,
};
