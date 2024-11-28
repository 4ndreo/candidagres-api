import { ObjectId } from "mongodb";
import * as cartService from "../services/cart.service.js"
import * as productosService from "../services/productos.service.js"

async function create(req, res) {
    const id_user = req.body.id_user;

    if (id_user) {
        await cartService.create({ id_user: id_user, productos: [] })
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
async function findByIdUser(req, res) {
    const userId = req.params.id;

    try {
        const cart = await cartService.findByIdUser(userId)
        if (cart) {
            const products = await productosService.findMultipleById(cart.items.map(product => product.id))
            cart.items.forEach((product, index) => {
                cart.items[index] = { ...cart.items[index], ...products.find(x => x._id.equals(product.id)) };
                if (cart.items[index].deleted) {
                    cart.items.splice(index, 1)
                }
            })
            res.status(200).json(cart);
        } else {
            const newCart = await cartService.create({ id_user: userId, items: [] })
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
    const carritoID = req.params.idCarrito;

    cartService.remove(carritoID)
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
    cartService.update(carritoId, productos)
        .then(function (carrito) {
            res.status(201).json(carrito);
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
    const cart = await cartService.findByIdUser(req.params.idUser)
    if (!cart) {
        const newCart = await cartService.create({ id_user: req.params.idUser, items: [{ id: req.body.item.id, quantity: 1 }] })
        return res.status(201).json(newCart);
    }
    const item = cart.items.find(item => item.id === req.body.item.id)
    cart.items[cart.items.indexOf(item) > -1 ? cart.items.indexOf(item) : cart.items.length] = { id: req.body.item.id, quantity: item?.quantity ? item.quantity + 1 : 1 }
    cartService.update(cart._id, cart.items)
        .then(function (carrito) {
            res.status(201).json(carrito);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function substractToCart(req, res) {
    const cart = await cartService.findByIdUser(req.params.idUser)
    if (!cart) {
        return res.status(404).json('No existe el carrito');
    }
    const item = cart.items.find(item => item.id === req.body.item.id)
    item?.quantity === 1 ? cart.items.splice(cart.items.indexOf(item), 1) :
        cart.items[cart.items.indexOf(item)] = { id: req.body.item.id, quantity: item?.quantity - 1 }
    cartService.update(cart._id, cart.items)
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
    // findByIdUserFinalizado,
    remove,
    update,
    // updateEliminarProducto,
    addToCart,
    substractToCart,
}