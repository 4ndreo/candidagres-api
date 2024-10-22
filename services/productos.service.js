import * as dataBase from "./base.service/database.handler.js";

const collection = "products"

async function create(data) {
    let newProduct = await dataBase.create(collection, data);
    return await dataBase.findById(collection, newProduct.insertedId)
}

async function find(request) {
    return await dataBase.find(collection, request)
}

async function findQuery(request, idUser = null) {
    return await dataBase.findQuery(collection, request, idUser)
}

async function findById(id) {
    return await dataBase.findById(collection, id)
}

async function findMultipleById(ids) {
    return await dataBase.findMultipleById(collection, ids)
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
    findQuery,
    findById,
    findMultipleById,
    remove,
    update,
}