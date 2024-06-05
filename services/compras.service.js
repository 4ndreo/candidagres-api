import * as dataBase from "./base.service/database.handler.js";

const collection = "compras"

async function create(compras) {
    await dataBase.create(collection, compras);
    return await dataBase.filter(collection, { deleted: false })
}

async function find() {
    return await dataBase.find(collection)
}

async function findById(id) {
    return await dataBase.findById(collection, id)
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
    return await dataBase.filter(collection, { deleted: false })
}

export {
    create,
    find,
    findById,
    findManyByIdUser,
    remove,
    update
}