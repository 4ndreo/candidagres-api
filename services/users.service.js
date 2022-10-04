import * as dataBase from "./base.service/database.handler.js";
import bcrypt from 'bcrypt'
import {findOne, findOneByEmail} from "./base.service/database.handler.js";

const collection = "users";

async function find() {
  return await dataBase.find(collection);
}

async function findUserById(id) {
  return await dataBase.findById(collection, id);
}

async function create(user) {

    const userOld = await dataBase.findOneByEmail(collection, {email: user.email})

    if(!userOld){
      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(user.password, salt)
      const userToCreate = {
        ...user,
        password: passwordHash
      }
      await dataBase.create(collection, userToCreate)
      return userToCreate
    } else {
      throw new Error('User already exists')
    }

}

async function remove(id) {
    await dataBase.remove(collection, id);
    return await dataBase.filter(collection, { deleted: false })

}

async function update(id, data) {
    await dataBase.update(collection, id, data);
    return await dataBase.filter(collection, { deleted: false })
}

async function login({email, password}) {

    const user = await dataBase.findOne(collection, email)
    if (user){
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (isPasswordValid){
        return {...user, password: undefined}
      }
    }

}

async function auth(userData) {

    const user = await dataBase.findOne(collection, userData.email)
    if (user){
        return {...user, password: undefined}
    }


}

export { find, findUserById, create, remove, update, login, auth };
