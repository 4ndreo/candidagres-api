import * as dataBase from "./base.service/database.handler.js";

const collection = "location_requests";

async function find() {
  return await dataBase.find(collection);
}

async function findLocationRequestById(id) {
  return await dataBase.findById(collection, id);
}

async function findLocationRequestByUser(idUser) {
  return await dataBase.filter(collection, { user: idUser });
}

async function create(locationRequest) {
  await dataBase.create(collection, locationRequest);
  return await dataBase.find(collection);
}

async function remove(id) {
  await dataBase.remove(collection, id);
  return await dataBase.filter(collection, { deleted: false });
}

async function update(id, data) {
  await dataBase.update(collection, id, data);
  return await dataBase.find(collection);
}

export {
  find,
  findLocationRequestById,
  findLocationRequestByUser,
  create,
  remove,
  update,
};
