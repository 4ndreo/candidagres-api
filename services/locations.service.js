import * as dataBase from "./base.service/database.handler.js";

const collection = "locations";

async function find() {

  return await dataBase.find(collection)

}

async function findLocationById(id) {
  return await dataBase.findById(collection, id)
}

async function findLocationByCity(city) {
  return await dataBase.filter(collection, city)
}

async function create(location) {

    await dataBase.create(collection, location);
    return await dataBase.filter(collection, { deleted: false })

}

async function remove(id) {

    await dataBase.remove(collection, id);
    return await dataBase.filter(collection, { deleted: false })

}

async function update(id, data) {

    await dataBase.update(collection, id, data);
    return await dataBase.filter(collection, { deleted: false })

}

export { find, findLocationById, findLocationByCity, create, remove, update };
