import * as dataBase from "./base.service/database.handler.js";


const collection = "cursos"

async function create(curso) {

    await dataBase.create(collection, curso);
    return await dataBase.filter(collection, { deleted: false })

}

async function find() {

    return await dataBase.find(collection)

}

async function findTurnoById(id) {
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

export {
    create,
    find,
    findTurnoById,
    remove,
    update
}