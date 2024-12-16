import * as dataBase from "./base.service/database.handler.js";
const collection = "openClassEnrollments"

async function create(data) {
    const newEnrollment = await dataBase.create(collection, data);
    return await dataBase.findById(collection, newEnrollment.insertedId)
}

async function findQuery(request, idUser = null) {
    return await dataBase.findQuery(collection, request, idUser, [])
}

async function findOneByEmail(email) {
    return await dataBase.findOneByEmail(collection, email);
}


export {
    create,
    findQuery,
    findOneByEmail,
}