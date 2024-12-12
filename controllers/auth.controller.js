import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { validateCUIL, validateDNI, validateDate, validateEmail, validateImage, validatePassport, validatePassword, validateRole, validateVerificationCode } from "../utils/validators.js";
import cloudinary from "../config/cloudinaryConfig.cjs";
import * as usersService from "../services/users.service.js";
import * as authService from "../services/auth.service.js";
import { ObjectId } from "mongodb";
import transporter from "../config/mailConfig.cjs";
import { createEmailTemplate } from "../config/restorePasswordTemplate.js";


async function register(req, res) {
  const user = req.body;
  const newErrors = {};
  const allowedFields = [
    "first_name",
    "last_name",
    "document_type",
    "id_document",
    "email",
    "password",
    "birth_date",
  ];

  Object.keys(user).forEach((field) => {
    if (!allowedFields.includes(field)) {
      delete user[field];
    }
  })

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

  const userOld = await usersService.findOneByEmail(user.email)
  const idDocumentOld = await usersService.findOneByIdDocument(user.id_document)

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
  await usersService.create(newUser)
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
  const oldUser = await usersService.findById(new ObjectId(user.id))

  if (idUser !== user.id) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const allowedFields = [
    "first_name",
    "last_name",
    "document_type",
    "id_document",
    "birth_date",
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

  // Validate

  const newErrors = {};

  if (typeof data.first_name !== 'undefined' && data.first_name?.length <= 0) newErrors.first_name = 'Debe completar el nombre.';
  if (typeof data.last_name !== 'undefined' && data.last_name?.length <= 0) newErrors.last_name = 'Debe completar el apellido.';
  if (typeof data.birth_date !== 'undefined' && validateDate(data.birth_date)) newErrors.birth_date = validateDate(data.birth_date)

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

  if (typeof req.file !== 'undefined' && validateImage(req.file)) newErrors.img = validateImage(req.file);

  const idDocumentOld = await usersService.findOneByIdDocument(data.id_document)

  if (idDocumentOld) newErrors.id_document = 'Ya existe un usuario con ese documento.'

  if (Object.keys(newErrors).length !== 0) {
    return res.status(400).json({ err: newErrors });
  }

  // Upload image
  if (req.file !== undefined) {
    const buffer = req.file.buffer.toString('base64');

    await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${buffer}`, { folder: 'profile' }, (error, result) => {
      if (error) {
        newErrors.img = 'Error al subir la imagen. Intentalo nuevamente.'
      }
      data.image = result.display_name;
    });
  }

  // Delete previous image
  if (!newErrors.img) {
    await cloudinary.uploader.destroy('profile/' + oldUser.image, (error, result) => {
      if (error) {
        console.error('error deleting previous image', error)
      }
    });
  }

  if (Object.keys(newErrors).length !== 0) {
    return res.status(400).json({ err: newErrors });
  }
  usersService.update(user.id, data)
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
  const allowedFields = [
    "email",
    "password",
  ];

  Object.keys(user).forEach((field) => {
    if (!allowedFields.includes(field)) {
      delete user[field];
    }
  })

  if (validateEmail(user.email)) newErrors.email = validateEmail(user.email);
  if (validatePassword(user.password)) newErrors.password = validatePassword(user.password);

  if (Object.keys(newErrors).length !== 0) {
    return res.status(400).json({ err: newErrors });
  }

  authService.login(user)
    .then((userData) => {
      const token = jwt.sign({ id: userData._id, email: userData.email, role: userData.role }, process.env.JWT_SECRET);
      res.status(200).json({ userData, token });
    })
    .catch((err) => {
      res.status(500).json({ err: { password: err.message } });
    });
}


async function restorePassword(req, res) {
  const user = req.body;
  const newErrors = {};
  const allowedFields = [
    "email",
  ];

  Object.keys(user).forEach((field) => {
    if (!allowedFields.includes(field)) {
      delete user[field];
    }
  })

  if (validateEmail(user.email)) newErrors.email = validateEmail(user.email);

  if (Object.keys(newErrors).length !== 0) {
    return res.status(400).json({ err: newErrors });
  }

  usersService.findOneByEmail(user.email).then((userData) => {
    if (!userData) {
      res.status(500).json({ err: { email: "Este correo no pertenece a un usuario." } });
    } else {
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      const restorePasswordToken = jwt.sign({ verificationCode }, process.env.JWT_SECRET, { expiresIn: '300s' });
      usersService.update(userData._id, { restore_password_token: restorePasswordToken });

      const mailData = {
        from: 'hola@candidagres.com',  // TODO: replace with production mail sender
        to: 'franjandreo@gmail.com',   // TODO: replace with user.email
        subject: 'Restaurá tu contraseña',
        html: createEmailTemplate(userData, verificationCode),
      };

      transporter.sendMail(mailData, function (err, info) {
        if (err)
          res.status(500).json({ email: user.email, err: err });
        else
          res.status(200).json({ id_user: userData._id, email: user.email, message: 'Email enviado con éxito.' });
      });
    }

  })
}

async function verifyEmailCode(req, res) {
  const user = req.body;
  const newErrors = {};
  const allowedFields = [
    "id",
    "verificationCode",
  ];

  Object.keys(user).forEach((field) => {
    if (!allowedFields.includes(field)) {
      delete user[field];
    }
  })

  if (validateVerificationCode(user.verificationCode)) newErrors.verificationCode = validateVerificationCode(user.verificationCode);

  if (Object.keys(newErrors).length !== 0) {
    return res.status(400).json({ err: newErrors });
  }

  authService.verifyCode({ id_user: user.id, verificationCode: user.verificationCode })
    .then(() => {
      res.status(200).json({ status: 'ok', message: 'Código verificado con éxito.' });
    })
    .catch((err) => {
      res.status(500).json({ err: { verificationCode: err.message } });
    });
}

async function changePassword(req, res) {
  const data = req.body;
  const newErrors = {};
  if (validatePassword(data.password)) newErrors.password = validatePassword(data.password);
  if (validatePassword(data.confirm_password)) newErrors.confirm_password = validatePassword(data.confirm_password);

  if (data.password !== data.confirm_password) newErrors.confirm_password = 'Las contraseñas no coinciden.'

  if (Object.keys(newErrors).length !== 0) {
    return res.status(400).json({ err: newErrors });
  }

  try {
    await authService.verifyCode({ id_user: data.id, verificationCode: data.verificationCode })

  } catch (err) {

    return res.status(400).json({ err: { verification_code: err.message } });
  }

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(data.password, salt)

  usersService.update(data.id, { password: passwordHash, restore_password_token: null })
    .then((userData) => {
      res.status(200).json({ ...userData, password: undefined, restore_password_token: undefined });
    })
    .catch((err) => {
      res.status(500).json({ err: { password: err.message } });
    });
}



export default {
  login,
  register,
  updateProfile,
  restorePassword,
  verifyEmailCode,
  changePassword,
};
