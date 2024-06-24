import * as dataBase from "./base.service/database.handler.js";
import fs from 'node:fs';
import path from 'node:path';

const collection = "productos"

async function create(producto) {

    let newProduct = await dataBase.create(collection, producto);
    return await dataBase.findById(collection, newProduct.insertedId)

}

async function find() {

    return await dataBase.find(collection)

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

async function saveImage(file){

    const ext = path.extname(file.originalname)
    const newPath = `./uploads/${file.filename + ext}`;
    fs.renameSync(file.path, newPath);
    return `${file.filename + ext}`;
}

export {
    create,
    find,
    findProductoById,
    findMultipleById,
    remove,
    update,
    saveImage
}