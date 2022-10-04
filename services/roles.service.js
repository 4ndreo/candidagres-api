import * as dataBase from "./base.service/database.handler.js";

const collection = "roles";

async function find() {
  return await dataBase.find(collection);
}

async function findRoleById(id) {
  return await dataBase.findById(collection, id);
}

async function create(role) {
  await dataBase.create(collection, role);
  return await dataBase.find(collection);
}

async function remove(id) {
  await dataBase.remove(collection, id);
  return await dataBase.find(collection);
}

async function update(id, role) {
  await dataBase.update(collection, id, role);
  return await dataBase.find(collection);
}

export { find, findRoleById, create, remove, update };
