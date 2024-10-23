import jwt from "jsonwebtoken";
import * as productosService from "../services/productos.service.js"
import { ObjectId } from "mongodb";


async function create(req, res) {
    const incomingToken = req.headers["auth-token"];
    const user = jwt.verify(incomingToken, process.env.JWT_SECRET);

    const productData = { ...req.body, price: Number(req.body.price), estimated_delay: Number(req.body.estimated_delay) };
    const newErrors = {};

    if (productData.title?.length <= 0 || !productData.title) newErrors.title = 'Debe completar el título.';
    if (productData.description?.length <= 0 || !productData.description) newErrors.description = 'Debe completar la descripción.';
    if (isNaN(productData.estimated_delay) || !productData.estimated_delay || productData.estimated_delay < 0) newErrors.estimated_delay = 'Debe ingresar un número válido.';
    if (isNaN(productData.price) || !productData.price || productData.price < 0) newErrors.price = 'Debe ingresar un precio válido.';
    if (productData.material?.length <= 0 || !productData.material) newErrors.material = 'Debe completar el material.';
    
    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }

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

    productosService.findById(productoID)
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
    // const data = req.body;
    const productData = req.body;

    console.log(productData)


     // Format
     if (typeof productData.title !== 'undefined') productData.title = String(req.body.title);
     if (typeof productData.description !== 'undefined') productData.description = String(req.body.description);
     if (typeof productData.estimated_delay !== 'undefined') productData.estimated_delay = Number(req.body.estimated_delay);
     if (typeof productData.price !== 'undefined') productData.price = Number(req.body.price);
     if (typeof productData.material !== 'undefined') productData.material = String(req.body.material);
 
     // Validate
     const newErrors = {};
 
     if (typeof productData.title !== 'undefined' && productData.title?.length <= 0) newErrors.title = 'Debe completar el título.';
     if (typeof productData.description !== 'undefined' && productData.description?.length <= 0) newErrors.description = 'Debe completar la descripción.';
     if (typeof productData.estimated_delay !== 'undefined' && (isNaN(productData.estimated_delay) || productData.estimated_delay < 0)) newErrors.estimated_delay = 'Debe ingresar un número mayor o igual a 0.';
     if (typeof productData.price !== 'undefined' && (isNaN(productData.price) || productData.price < 0)) newErrors.price = 'Debe ingresar un número mayor o igual a 0.';
     if (typeof productData.material !== 'undefined' && productData.material?.length <= 0) newErrors.material = 'Debe completar el material.';
     
     if (Object.keys(newErrors).length !== 0) {
         return res.status(400).json({ err: newErrors });
     }

    productosService.update(productoID, productData)
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