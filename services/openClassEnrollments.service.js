import * as dataBase from "./base.service/database.handler.js";
const collection = "openClassEnrollments"

async function create(data) {
    const newEnrollment = await dataBase.create(collection, data);
    return await dataBase.findById(collection, newEnrollment.insertedId)
}


async function findOneByEmail(email) {
    return await dataBase.findOneByEmail(collection, email);
}


export {
    create,
    findOneByEmail
}