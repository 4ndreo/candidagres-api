import * as dataBase from "./base.service/database.handler.js";
import bcrypt from 'bcrypt'
const collection = "users";
import jwt from "jsonwebtoken";

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

async function verifyCode({ id_user, verificationCode }) {
  const user = await dataBase.findById(collection, id_user)
  if (user.restore_password_token) {
    try {
      const currentVerificationCode = jwt.verify(user.restore_password_token, process.env.JWT_SECRET);
      if (currentVerificationCode.verificationCode === Number(verificationCode)) {
        return { ...user, password: undefined, restore_password_token: undefined }
      } else {
        throw new Error('El código es incorrecto.')
      }
    } catch (error) {
      console.error(error)
      if (error.expiredAt) throw new Error('El código ha expirado.')
      throw new Error('El código es incorrecto.')
    }

  } else {
    throw new Error('El usuario no solicitó un cambio de contraseña.')
  }

}


export {
  login,
  verifyCode,
};
