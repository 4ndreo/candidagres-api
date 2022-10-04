import * as dataBase from "./base.service/database.handler.js";

const collection = "favorites";

async function find(id) {
    return await dataBase.filter(collection, {userId: id, deleted: false});
}


async function create(favorites) {
    await dataBase.create(collection, favorites);
    return await dataBase.find(collection);
}


async function remove(id) {
    await dataBase.remove(collection, id);
    return await dataBase.find(collection);

}

export { find, create, remove };
