import * as dataBase from "./base.service/database.handler.js";
const collection = "classes"

async function create(data) {
    const newClass = await dataBase.create(collection, data);
    return await dataBase.findById(collection, newClass.insertedId)
}

async function find() {
    return await dataBase.find(collection)
}

async function findQuery(request, idUser = null) {
    return await dataBase.findQuery(collection, request, idUser)
}

async function findOneWithShifts(id) {
    return await dataBase.findOneRelated(collection, id, { source: "classes", from: 'shifts', localField: '_id', foreignField: 'id_class', as: 'shifts' }
        , { source: "shifts", from: 'enrollments', localField: 'shifts._id', foreignField: 'id_shift', as: 'shifts.enrollments' })
}

async function findCursoById(id) {
    return await dataBase.findById(collection, id)
}

async function remove(id) {
    const classRelated = await dataBase.findOneRelated(collection, id, { source: "classes", from: 'shifts', localField: '_id', foreignField: 'id_class', as: 'shifts' }, { source: "shifts", from: 'enrollments', localField: 'shifts._id', foreignField: 'id_shift', as: 'shifts.enrollments' })
    classRelated[0].shifts.forEach(async shift => {
        shift.enrollments.forEach(async enrollment => {
            await dataBase.remove('enrollments', enrollment._id);
        })
        await dataBase.remove('shifts', shift._id);
    });
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
    findQuery,
    findOneWithShifts,
    findCursoById,
    remove,
    update
}