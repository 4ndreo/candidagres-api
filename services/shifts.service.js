import { ObjectId } from "mongodb";
import * as dataBase from "./base.service/database.handler.js";

const collection = "shifts"

async function create(data) {
    const newShift = await dataBase.create(collection, data);
    return await dataBase.findById(collection, newShift.insertedId)
}

async function find() {
    return await dataBase.find(collection)
}

async function filter(params) {
    return await dataBase.filter(collection, params)
}

async function findQuery(request, idUser = null) {
    return await dataBase.findQuery(collection, request, idUser, [{ from: 'classes', localField: 'id_class', foreignField: '_id', as: 'class' }])
}

async function findOneWithEnrollments(id) {
    return await dataBase.findOneRelated(collection, id, { source: "shifts", from: 'enrollments', localField: '_id', foreignField: 'id_shift', as: 'enrollments' })
}

async function findById(id) {
    return await dataBase.findById(collection, id)
}

async function findByCurso(id) {
    return await dataBase.filter(collection, { id: id, deleted: false })
}

async function remove(id) {
    await dataBase.remove(collection, id);
    return await dataBase.filter(collection, { deleted: false })
}

async function update(id, data) {
    await dataBase.update(collection, id, data);
    return await dataBase.findById(collection, id)
}

export {
    create,
    find,
    filter,
    findQuery,
    findOneWithEnrollments,
    findById,
    findByCurso,
    remove,
    update
}