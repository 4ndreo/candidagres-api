import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import * as cartService from "../services/cart.service.js"
import * as productsService from "../services/products.service.js"

async function create(req, res) {
    const userData = req.body;
    const allowedFields = [
        "id_user",
    ];

    Object.keys(userData).forEach((field) => {
        if (!allowedFields.includes(field)) {
            delete userData[field];
        }
    })

    if (userData.id_user) {
        await cartService.create({ id_user: userData.id_user, items: [] })
            .then(function (data) {
                res.status(201).json(data);
            })
            .catch(function (err) {
                res.status(500).json(err);
            });

    } else {
        return res.status(404).json('Debe proveer el id del usuario.');

    }
}


async function find(req, res) {
    cartService.find()
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const cartId = req.params.id;

    cartService.findById(cartId)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}
async function findByUser(req, res) {
    const userId = req.params.id;
    const incomingToken = req.headers["auth-token"];
    const userData = jwt.verify(incomingToken, process.env.JWT_SECRET);
    if (userData.id !== userId) return res.status(403).json({ message: 'No tiene permisos para ver este recurso' });
    try {
        const cart = await cartService.findByIdUser(userData.id)
        if (cart) {
            const products = await productsService.findMultipleById(cart.items.map(product => product.id))
            cart.items.forEach((product, index) => {
                cart.items[index] = { ...cart.items[index], ...products.find(x => x._id.equals(product.id)) };
                if (cart.items[index].deleted) {
                    cart.items.splice(index, 1)
                }
            })
            res.status(200).json(cart);
        } else {
            const newCart = await cartService.create({ id_user: userData.id, items: [] })
            res.status(201).json(newCart);
        }

    } catch (error) {
        res.status(500).json({ error });
    }
}

// async function findByIdUserFinalizado(req, res) {
//     const userID = req.params.idUser;
//     cartService.findByIdUserFinalizado(userID)
//         .then(function (carrito) {
//             res.status(200).json(carrito);
//         })
//         .catch(function (err) {
//             res.status(500).json({ err });
//         });
// }

async function remove(req, res) {
    const cartId = req.params.id;

    cartService.remove(cartId)
    .then(function (data) {
        if (data) {
            res.status(200).json({ message: `La compra con id ${cartId} se ha eliminado` });
        } else {
            res.status(404).json({ message: `La compra con id ${cartId} no existe` });
        }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function update(req, res) {
    const id = req.params.id;
    const cartData = req.body;

    const allowedFields = [
        "items",
    ];

    Object.keys(cartData).forEach((field) => {
        if (!allowedFields.includes(field)) {
            delete cartData[field];
        }
    })

    cartService.update(id, cartData)
        .then(function (data) {
            res.status(201).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}
// async function updateEliminarProducto(req, res) {
//     const carritoID = req.params.idCarrito;
//     const { total, productosComprar } = req.body;
//     cartService.updateEliminarProducto(carritoID, total, productosComprar)
//         .then(function (carrito) {
//             res.status(201).json(carrito);
//         })
//         .catch(function (err) {
//             res.status(500).json({ err });
//         });
// }

async function addToCart(req, res) {
    const cart = await cartService.findByIdUser(req.params.id)
    if (!cart) {
        const newCart = await cartService.create({ id_user: req.params.id, items: [{ id: req.body.item.id, quantity: 1 }] })
        return res.status(201).json(newCart);
    }
    const item = cart.items.find(item => item.id === req.body.item.id)
    cart.items[cart.items.indexOf(item) > -1 ? cart.items.indexOf(item) : cart.items.length] = { id: req.body.item.id, quantity: item?.quantity ? item.quantity + 1 : 1 }
    cartService.update(cart._id, { items: cart.items })
        .then(function (carrito) {
            res.status(201).json(carrito);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function substractToCart(req, res) {
    const cart = await cartService.findByIdUser(req.params.id)
    if (!cart) {
        return res.status(404).json('No existe el carrito');
    }
    const item = cart.items.find(item => item.id === req.body.item.id)
    item?.quantity === 1 ? cart.items.splice(cart.items.indexOf(item), 1) :
        cart.items[cart.items.indexOf(item)] = { id: req.body.item.id, quantity: item?.quantity - 1 }
    cartService.update(cart._id, { items: cart.items })
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
    findByUser,
    update,
    addToCart,
    substractToCart,
    remove,
    // findByIdUserFinalizado,
    // updateEliminarProducto,
}