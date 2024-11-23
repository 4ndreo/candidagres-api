import jwt from "jsonwebtoken";
import * as productosService from "../services/productos.service.js"
import { ObjectId } from "mongodb";
import cloudinary from "../config/cloudinaryConfig.cjs";
import { validateImage, validateInteger } from "../utils/validators.js";


async function create(req, res) {
    const incomingToken = req.headers["auth-token"];
    const user = jwt.verify(incomingToken, process.env.JWT_SECRET);

    const productData = { ...req.body, price: Number(req.body.price), estimated_delay: Number(req.body.estimated_delay) };
    const newErrors = {};

    if (productData.title?.length <= 0 || !productData.title) newErrors.title = 'Debe completar el título.';
    if (productData.description?.length <= 0 || !productData.description || productData.description?.length > 256) newErrors.description = 'La descripción debe tener entre 1 y 255 caracteres.';
    if (isNaN(productData.estimated_delay) || !productData.estimated_delay || validateInteger(productData.estimated_delay)) newErrors.estimated_delay = validateInteger(productData.estimated_delay);
    if (isNaN(productData.estimated_delay) || !productData.estimated_delay || productData.estimated_delay < 0) newErrors.estimated_delay = 'Debe ingresar un número válido.';
    if (isNaN(productData.price) || !productData.price || validateInteger(productData.price)) newErrors.price = validateInteger(productData.price);
    if (isNaN(productData.price) || !productData.price || productData.price < 0) newErrors.price = 'Debe ingresar un precio válido.';
    if (productData.material?.length <= 0 || !productData.material) newErrors.material = 'Debe completar el material.';
    if (validateImage(req.file)) newErrors.img = validateImage(req.file);

    // Upload image
    if (req.file !== undefined) {
        const buffer = req.file.buffer.toString('base64');

        await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${buffer}`, { folder: 'products' }, (error, result) => {
            if (error) {
                newErrors.img = 'Error al subir la imagen. Intentalo nuevamente.'
            }
            productData.img = result.display_name;
        });
    }

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }

    await productosService.create({ ...productData, created_by: new ObjectId(user.id) })
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

    productosService.findQuery(req.query)
        .then(function (producto) {
            res.status(200).json(producto);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findOwn(req, res) {
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
    const idProduct = req.params.id;

    productosService.findByIdRelated(idProduct)
        .then(function (data) {
            res.status(200).json(data[0]);
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
    const incomingToken = req.headers["auth-token"];
    const user = jwt.verify(incomingToken, process.env.JWT_SECRET);

    const productoID = req.params.idProductos;
    const oldProduct = await productosService.findById(new ObjectId(productoID))
    const productData = req.body;

    if (user.id !== oldProduct.created_by.toString()) {
        return res.status(403).json({ err: 'No tienes permisos para modificar este producto.' });
    }

    // Format
    if (typeof productData.title !== 'undefined') productData.title = String(req.body.title);
    if (typeof productData.description !== 'undefined') productData.description = String(req.body.description);
    if (typeof productData.estimated_delay !== 'undefined') productData.estimated_delay = Number(req.body.estimated_delay);
    if (typeof productData.price !== 'undefined') productData.price = Number(req.body.price);
    if (typeof productData.material !== 'undefined') productData.material = String(req.body.material);

    // Validate
    const newErrors = {};

    if (typeof productData.title !== 'undefined' && productData.title?.length <= 0) newErrors.title = 'Debe completar el título.';
    if (typeof productData.description !== 'undefined' && (productData.description?.length <= 0 || productData.description?.length > 256)) newErrors.description = 'La descripción debe tener entre 1 y 255 caracteres.';
    if (typeof productData.estimated_delay !== 'undefined' && (isNaN(productData.estimated_delay) || validateInteger(productData.estimated_delay))) newErrors.estimated_delay = validateInteger(productData.estimated_delay);
    if (typeof productData.estimated_delay !== 'undefined' && (isNaN(productData.estimated_delay) || productData.estimated_delay < 0)) newErrors.estimated_delay = 'Debe ingresar un número mayor o igual a 0.';
    if (typeof productData.price !== 'undefined' && (isNaN(productData.price) || validateInteger(productData.price))) newErrors.price = validateInteger(productData.price);
    if (typeof productData.price !== 'undefined' && (isNaN(productData.price) || productData.price < 0)) newErrors.price = 'Debe ingresar un número mayor o igual a 0.';
    if (typeof productData.material !== 'undefined' && productData.material?.length <= 0) newErrors.material = 'Debe completar el material.';

    if (typeof req.file !== 'undefined' && validateImage(req.file)) newErrors.img = validateImage(req.file);

    // Upload image
    if (req.file !== undefined) {
        const buffer = req.file.buffer.toString('base64');

        await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${buffer}`, { folder: 'products' }, (error, result) => {
            if (error) {
                newErrors.img = 'Error al subir la imagen. Intentalo nuevamente.'
            }
            productData.img = result.display_name;
        });
    }

    // Delete previous image
    if (!newErrors.img) {
        await cloudinary.uploader.destroy('products/' + oldProduct.img, (error, result) => {
            if (error) {
                console.error('error deleting previous image', error)
            }
            console.error('previous image deleted')
        });
    }


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
    findOwn,
    findById,
    remove,
    update,
}