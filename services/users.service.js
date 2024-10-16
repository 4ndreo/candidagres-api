import * as dataBase from "./base.service/database.handler.js";
import bcrypt from 'bcrypt'
const collection = "users";

async function find() {
  return await dataBase.find(collection);
}

async function findUserById(id) {
  return await dataBase.findUserById(collection, id);
}

async function findOneByEmail(email) {
  return await dataBase.findOneByEmail(collection, email);
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
  return await dataBase.filter(collection, { deleted: false })
}

async function login({ email, password }) {

  const user = await dataBase.findOneByEmail(collection, email)
  if (user) {

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (isPasswordValid) {
      return { ...user, password: undefined }
    } else {

      throw new Error('Las credenciales son incorrectas.')
    }
  } else {
    return user
  }

}

async function auth(userData) {

  const user = await dataBase.findOne(collection, userData.email)
  if (user) {
    return { ...user, password: undefined }
  }


}

export { find, findUserById, findOneByEmail, create, remove, update, login, auth };
