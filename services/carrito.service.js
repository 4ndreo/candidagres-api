import * as dataBase from "./base.service/database.handler.js";


const collection = "carrito"

async function create(carrito) {

    await dataBase.create(collection, carrito);
    return await dataBase.filter(collection, { deleted: false })

}

async function find() {

    return await dataBase.find(collection)

}

async function findCarritoById(id) {
    return await dataBase.findById(collection, id)
}
async function findCarritoByIdUser(id) {
    return await dataBase.findByIdUser(collection, id)
}


async function remove(id) {

    await dataBase.remove(collection, id);
    return await dataBase.filter(collection, { deleted: false })

}


async function update(id, total, detallesProducto) {
    await dataBase.updateCarrito(collection, id, { total, productosComprar: detallesProducto });
    return await dataBase.filter(collection, { deleted: false });
}


export {
    create,
    find,
    findCarritoById,
    findCarritoByIdUser,
    remove,
    update,
}