import * as carritoService from "../services/carrito.service.js"




async function create(req, res) {
    const newCarrito = req.body;

    await carritoService.create(newCarrito)
        .then(function (newCarrito) {
            // console.log(newProducto)
            res.status(201).json(newCarrito);
            // req.socketClient.emit('newLocation', { newLocation })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
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
    console.log(userID)
    carritoService.findCarritoByIdUser(userID)
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
    const carritoID = req.params.idCarrito;
    const { total, productosComprar } = req.body;
    console.log(total, productosComprar)
    carritoService.update(carritoID, total, productosComprar)
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
   // console.log(total, productosComprar)

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
    remove,
    update,
    updateEliminarProducto
}