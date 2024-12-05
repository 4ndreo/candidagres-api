import { ObjectId } from "mongodb";
import * as dataBase from "./base.service/database.handler.js";
const collection = "enrollments"

async function create(data) {
    const newEnrollment = await dataBase.create(collection, data);
    return await dataBase.findById(collection, newEnrollment.insertedId)
    await dataBase.create(collection, data);
    return await dataBase.filter(collection, { deleted: false })
}

async function find() {
    return await dataBase.find(collection)
}

async function filter(params) {
    return await dataBase.filter(collection, params)
}

async function findQuery(request, idUser = null) {
    return await dataBase.findQuery(collection, request, idUser, [{ from: 'shifts', localField: 'id_shift', foreignField: '_id', as: 'shift' }, { source: "shift", from: 'classes', localField: 'shift.id_class', foreignField: '_id', as: 'shift.class' }, { from: 'users', localField: 'id_user', foreignField: '_id', as: 'user' }])
}

async function findByUser(idUser) {
    return await dataBase.findQuery(collection, { filter: `[{"field":"id_user","value":"${idUser}"}]` }, null, [{ from: 'shifts', localField: 'id_shift', foreignField: '_id', as: 'shift' }, { source: "shift", from: 'classes', localField: 'shift.id_class', foreignField: '_id', as: 'shift.class' }, { from: 'users', localField: 'id_user', foreignField: '_id', as: 'user' }])
}

// async function findAllByUserAndTurno(idUser, idTurno) {
//     return await dataBase.filter(collection, { idUser: idUser, idTurno: idTurno })
// }

// async function findAllByUser(idUser) {
//     return await dataBase.filter(collection, { idUser: idUser })
// }

async function findById(id) {
    return await dataBase.findById(collection, id)
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
    find,
    filter,
    findQuery,
    findByUser,
    findById,
    // findAllByUserAndTurno,
    // findAllByUser,
    create,
    remove,
    update,
}