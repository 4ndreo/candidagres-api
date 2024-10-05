import * as dataBase from "./base.service/database.handler.js";

const collection = "productos"

async function create(producto) {
    let newProduct = await dataBase.create(collection, producto);
    return await dataBase.findById(collection, newProduct.insertedId)
}

async function find(request) {
    return await dataBase.find(collection, request)
}

async function findQuery(request) {
    return await dataBase.findQuery(collection, request)
}

async function findProductoById(id) {
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
    findProductoById,
    findMultipleById,
    remove,
    update,
}