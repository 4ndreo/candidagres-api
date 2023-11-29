import * as productosService from "../services/productos.service.js"




async function create(req, res) {
    const newProducto = req.body;

    await productosService.create(newProducto)
        .then(function (newProducto) {
            // console.log(newProducto)
            res.status(201).json(newProducto);
            // req.socketClient.emit('newLocation', { newLocation })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function find(req, res) {
    productosService.find()
        .then(function (producto) {
            res.status(200).json(producto);
            // req.socketClient.emit('locationsList', { turno })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const productoID = req.params.idProductos;

    productosService.findProductoById(productoID)
        .then(function (producto) {
            res.status(200).json(producto);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function remove(req, res) {
    const productoID = req.params.idProductos;

    productosService.remove(productoID)
        .then(function (producto) {
            if (producto) {
                res.status(200).json(producto);
                // req.socketClient.emit('locationsList', { location })
            } else {
                res
                    .status(404)
                    .json({ message: `El alumno con id ${producto} no existe` });
            }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function update(req, res) {
    const productoID = req.params.idProductos;
    const data = req.body;

    productosService.update(productoID, data)
        .then(function (producto) {
            res.status(201).json(producto);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


export default {
    create,
    find,
    findById,
    remove,
    update
}