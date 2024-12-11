import * as dataBase from "./base.service/database.handler.js";

const collection = "purchases"

async function create(data) {
    let res = await dataBase.create(collection, data);
    return await dataBase.findById(collection, res.insertedId)
}

async function find() {
    return await dataBase.find(collection)
}

async function filter(filter) {
    return await dataBase.filter(collection, filter)
}

async function findById(id) {
    return await dataBase.findById(collection, id)
}

async function findPendingByCartId(id) {
    return await dataBase.filter(collection, { carritoId: id, state: "pending" })
}

async function findManyByIdUser(id) {
    return await dataBase.findManyByIdUser(collection, id)
}

async function remove(id) {
    await dataBase.remove(collection, id);
    return await dataBase.filter(collection, { deleted: false })
}


async function update(id, data) {
    await dataBase.update(collection, id, data);
    return await dataBase.findById(collection, id)
    // return await dataBase.filter(collection, { deleted: false })
}

export {
    create,
    find,
    filter,
    findById,
    findPendingByCartId,
    findManyByIdUser,
    remove,
    update
}