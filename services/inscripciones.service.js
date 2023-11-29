import * as dataBase from "./base.service/database.handler.js";
const collection = "inscripciones"

async function create(inscripcion) {
    await dataBase.create(collection, inscripcion);
    return await dataBase.filter(collection, { deleted: false })
}

async function find() {
    return await dataBase.find(collection)
}

async function findByUser(idUser) {
    return await dataBase.filter(collection, {idUser: idUser, deleted: false})
}

async function findAllByUserAndTurno(idUser, idTurno) {
    return await dataBase.filter(collection, {idUser: idUser, idTurno: idTurno})
}

async function findAllByUser(idUser) {
    return await dataBase.filter(collection, {idUser: idUser})
}

async function findInscripcionById(id) {
    return await dataBase.findById(collection, id)
}

async function remove(id) {
    await dataBase.remove(collection, id);
    return await dataBase.filter(collection, { deleted: false })

}

async function update(id, data) {
    await dataBase.update(collection, id, data);
    return await dataBase.filter(collection, { deleted: false })
}

async function countInscripcionesByCurso(idCurso) {
    return await dataBase.countInscripcionesByCurso(collection, idCurso)
}

export {
    create,
    find,
    findByUser,
    findAllByUserAndTurno,
    findAllByUser,
    findInscripcionById,
    remove,
    update,
    countInscripcionesByCurso,
}