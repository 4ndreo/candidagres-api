import * as dataBase from "./base.service/database.handler.js";


const collection = "carrito"

async function create(usuarioId) {
    let newCarrito = await dataBase.create(collection, usuarioId);
    return await dataBase.findById(collection, newCarrito.insertedId)

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
async function findCarritoByIdUserFinalizado(id) {
    return await dataBase.findByIdUserFinalizado(collection, id)
}


async function remove(id) {

    await dataBase.remove(collection, id);
    return await dataBase.filter(collection, { deleted: true })

}


async function update(carritoId, productos) {
    await dataBase.updateCarrito(collection, carritoId, productos);
    return await dataBase.filter(collection, { deleted: false });
}
async function updateEliminarProducto(id, total, detallesProducto) {
    await dataBase.updateCarritoActualizado(collection, id, { total, productosComprar: detallesProducto });
    return await dataBase.findByIdCarrito(collection, id);
}


export {
    create,
    find,
    findCarritoById,
    findCarritoByIdUser,
    findCarritoByIdUserFinalizado,
    remove,
    update,
    updateEliminarProducto
}