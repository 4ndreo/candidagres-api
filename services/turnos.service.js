import * as dataBase from "./base.service/database.handler.js";

const collection = "turnos"

async function create(turno) {

    await dataBase.create(collection, turno);
    return await dataBase.filter(collection, { deleted: false })

}

async function find() {
    return await dataBase.find(collection)
}

async function findTurnoById(id) {
    return await dataBase.findById(collection, id)
}

async function findByCurso(idCurso) {
    return await dataBase.filter(collection, {idCurso: idCurso, deleted: false})
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
    findTurnoById,
    findByCurso,
    remove,
    update
}