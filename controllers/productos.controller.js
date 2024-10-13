import jwt from "jsonwebtoken";
import * as productosService from "../services/productos.service.js"
import { ObjectId } from "mongodb";


async function create(req, res) {
    const incomingToken = req.headers["auth-token"];
    const user = jwt.verify(incomingToken, process.env.JWT_SECRET);
    const newProducto = req.body;

    console.log(user.id)

    await productosService.create({ ...newProducto, created_by: new ObjectId(user.id) })
        .then(function (newProducto) {
            res.status(201).json(newProducto);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function find(req, res) {
    productosService.find(req.query)
        .then(function (producto) {
            res.status(200).json(producto);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findQuery(req, res) {
    const incomingToken = req.headers["auth-token"];
    const user = jwt.verify(incomingToken, process.env.JWT_SECRET);

    productosService.findQuery(req.query, user.role === 1 ? null : user.id)
        .then(function (producto) {
            res.status(200).json(producto);
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
                res.status(404).json({ message: `El alumno con id ${producto} no existe` });
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
    findQuery,
    findById,
    remove,
    update,
}