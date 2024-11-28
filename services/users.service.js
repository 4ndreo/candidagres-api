import * as dataBase from "./base.service/database.handler.js";
import bcrypt from 'bcrypt'
const collection = "users";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

async function find() {
  return await dataBase.find(collection);
}

async function findQuery(request, idUser = null) {
  return await dataBase.findQuery(collection, request, idUser)
}

async function findById(id) {
  return await dataBase.findById(collection, id);
}

async function findOneByEmail(email) {
  return await dataBase.findOneByEmail(collection, email);
}

async function findOneByIdDocument(id_document) {
  return await dataBase.findOne(collection, 'id_document', id_document);
}

async function create(user) {
  let newUser = await dataBase.create(collection, user);
  return await dataBase.findById(collection, newUser.insertedId)
}

async function remove(id) {
  await dataBase.remove(collection, id);
  return await dataBase.filter(collection, { deleted: false })

}

async function update(id, data) {
  await dataBase.update(collection, id, data);
  return await dataBase.filter(collection, { _id: ObjectId(id), deleted: false })
}

async function login({ email, password }) {

  const user = await dataBase.findOneByEmail(collection, email)
  if (user) {

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (isPasswordValid) {
      return { ...user, password: undefined, restore_password_token: undefined }
    } else {

      throw new Error('Las credenciales son incorrectas.')
    }
  } else {
    throw new Error('Las credenciales son incorrectas.')
  }

}

// async function verifyCode({ id_user, verificationCode }) {

//   const user = await dataBase.findById(collection, id_user)
//   if (user) {
//     try {
//       const currentVerificationCode = jwt.verify(user.restore_password_token, process.env.JWT_SECRET);
//       if (currentVerificationCode.verificationCode === Number(verificationCode)) {
//         return { ...user, password: undefined, restore_password_token: undefined }
//       }
//     } catch (error) {
//       if (error.expiredAt) throw new Error('El código ha expirado.')
//       else throw new Error('El código es incorrecto.')
//     }

//   } else {
//     throw new Error('El usuario no está registrado.')
//   }

// }

// async function auth(userData) {

//   const user = await dataBase.findOne(collection, 'email', userData.email)
//   if (user) {
//     return { ...user, password: undefined, restore_password_token: undefined }
//   }


// }

export {
  find,
  findQuery,
  findById,
  findOneByEmail,
  findOneByIdDocument,
  create,
  remove,
  update,
  // login,
  // verifyCode,
  // auth
};
