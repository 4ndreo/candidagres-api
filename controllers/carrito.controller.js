import { ObjectId } from "mongodb";
import * as carritoService from "../services/carrito.service.js"
import * as productosService from "../services/productos.service.js"




async function create(req, res) {
    const usuarioId = req.body.usuarioId;

    if (usuarioId) {
        await carritoService.create({ usuarioId: usuarioId, productos: [] })
            .then(function (newCarrito) {
                res.status(201).json(newCarrito);
                // req.socketClient.emit('newLocation', { newLocation })
            })
            .catch(function (err) {
                res.status(500).json(err);
            });

    } else {
        return res.status(404).json('Debe proveer el id del usuario.');

    }
}


async function find(req, res) {
    carritoService.find()
        .then(function (carrito) {
            res.status(200).json(carrito);
            // req.socketClient.emit('locationsList', { turno })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const carritoID = req.params.idCarrito;

    carritoService.findCarritoById(carritoID)
        .then(function (carrito) {
            res.status(200).json(carrito);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}
async function findByIdUser(req, res) {
    const userID = req.params.idUser;
    carritoService.findCarritoByIdUser(userID)
        .then(function (carrito) {
            let productosDetalle = [];
            productosService.findMultipleById(carrito.productos.map(producto => producto.id)).then((data) => {
                productosDetalle = data;
                carrito.productos.forEach((producto, index) => {
                    carrito.productos[index] = { ...carrito.productos[index], ...productosDetalle.find(x => x._id.equals(producto.id)) };
                    if (carrito.productos[index].deleted) {
                        carrito.productos.splice(index, 1)
                    }
                })
                res.status(200).json(carrito);
            })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}
async function findByIdUserFinalizado(req, res) {
    const userID = req.params.idUser;
    carritoService.findCarritoByIdUserFinalizado(userID)
        .then(function (carrito) {
            res.status(200).json(carrito);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function remove(req, res) {
    const carritoID = req.params.idCarrito;

    carritoService.remove(carritoID)
        .then(function (carrito) {
            if (carrito) {
                res.status(200).json(carrito);
                // req.socketClient.emit('locationsList', { location })
            } else {
                res
                    .status(404)
                    .json({ message: `El alumno con id ${carrito} no existe` });
            }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function update(req, res) {
    const carritoId = req.params.idCarrito;
    const productos = req.body.productos;
    carritoService.update(carritoId, productos)
        .then(function (carrito) {
            res.status(201).json(carrito);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}
async function updateEliminarProducto(req, res) {
    const carritoID = req.params.idCarrito;
    const { total, productosComprar } = req.body;
    carritoService.updateEliminarProducto(carritoID, total, productosComprar)
        .then(function (carrito) {
            res.status(201).json(carrito);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}




export default {
    create,
    find,
    findById,
    findByIdUser,
    findByIdUserFinalizado,
    remove,
    update,
    updateEliminarProducto
}