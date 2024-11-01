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

    try {
        const cart = await carritoService.findCarritoByIdUser(userID)
        if (cart) {
            const products = await productosService.findMultipleById(cart.items.map(producto => producto.id))
            cart.items.forEach((producto, index) => {
                cart.items[index] = { ...cart.items[index], ...products.find(x => x._id.equals(producto.id)) };
                if (cart.items[index].deleted) {
                    cart.items.splice(index, 1)
                }
            })
            res.status(200).json(cart);
        } else {
            const newCart = await carritoService.create({ usuarioId: userID, items: [] })
            res.status(201).json(newCart);
        }

    } catch (error) {
        res.status(500).json({ error });
    }
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

async function addToCart(req, res) {
    const cart = await carritoService.findCarritoByIdUser(req.params.idUser)
    if (!cart) {
        const newCart = await carritoService.create({ usuarioId: req.params.idUser, items: [{id: req.body.item.id, quantity: 1}] })
        return res.status(201).json(newCart);
    }
    const item = cart.items.find(item => item.id === req.body.item.id)
    cart.items[cart.items.indexOf(item) > -1 ? cart.items.indexOf(item) : cart.items.length] = {id: req.body.item.id, quantity: item?.quantity ? item.quantity + 1 : 1}
    carritoService.update(cart._id, cart.items)
        .then(function (carrito) {
            res.status(201).json(carrito);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function substractToCart(req, res) {
    const cart = await carritoService.findCarritoByIdUser(req.params.idUser)
    if (!cart) {
        return res.status(404).json('No existe el carrito');
    }
    const item = cart.items.find(item => item.id === req.body.item.id)
    item.quantity === 1 ? cart.items.splice(cart.items.indexOf(item), 1) :
    cart.items[cart.items.indexOf(item)] = {id: req.body.item.id, quantity: item.quantity - 1}
    carritoService.update(cart._id, cart.items)
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
    updateEliminarProducto,
    addToCart,
    substractToCart,
}