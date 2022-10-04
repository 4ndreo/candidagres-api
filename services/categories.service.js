import * as dataBase from "./base.service/database.handler.js";

const collection = "categories";

async function find() {
  return await dataBase.find(collection)
}

async function findCategoryById(id) {
  return await dataBase.findById(collection, id)
}

async function create(category) {
  await dataBase.create(collection, category);
  return await dataBase.find(collection);
}

async function update(id, category) {

  await dataBase.update(collection, id, category);
  return await dataBase.find(collection);

}

async function remove(id) {
    await dataBase.remove(collection, id);
    return await dataBase.find(collection);

}

export { find, findCategoryById, create, update, remove };
