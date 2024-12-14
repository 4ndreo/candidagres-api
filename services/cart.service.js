import * as dataBase from "./base.service/database.handler.js";

const collection = "cart"

async function create(userId) {
    let newCart = await dataBase.create(collection, userId);
    return await dataBase.findById(collection, newCart.insertedId)
}

async function find() {
    return await dataBase.find(collection)
}

async function findById(id) {
    return await dataBase.findById(collection, id)
}

async function findByIdUser(id) {
    return await dataBase.findByIdUser(collection, id)
}

async function remove(id) {
    await dataBase.remove(collection, id);
    return await dataBase.filter(collection, { deleted: true })
}

async function update(id, data) {
    await dataBase.update(collection, id, data);
    return await dataBase.findById(collection, id)
}

export {
    create,
    find,
    findById,
    findByIdUser,
    remove,
    update,
}