import * as dataBase from "./base.service/database.handler.js";

const collection = "icons";

async function find() {
  return await dataBase.find(collection);
}

async function findIconById(id) {
  return await dataBase.findById(collection, id);
}

async function create(icon) {
  await dataBase.create(collection, icon);
  return await dataBase.find(collection);
}

async function update(id, icon) {
  await dataBase.update(collection, id, icon);
  return await dataBase.find(collection);
}

async function remove(id) {
  await dataBase.remove(collection, id);
  return await dataBase.find(collection);
}

export { find, findIconById, create, update, remove };
