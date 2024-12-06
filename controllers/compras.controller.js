import * as comprasService from "../services/compras.service.js"
import * as productsService from "../services/products.service.js"
async function create(req, res) {
    const carrito = req.body;
    const products = req.body.productos;
    let productosDetalle = [];
    await productsService.findMultipleById(products.map(producto => producto.id)).then((data) => {
        productosDetalle = data;
        products.forEach((producto, index) => {
            products[index] = {
                ...products[index],
                ...productosDetalle.find(x => x._id.equals(producto.id))
            };
        })
    });

    carrito.created_at = new Date();

    await comprasService.create(carrito)
        .then(function (response) {
            res.status(201).json(response);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function find(req, res) {
    comprasService.find()
        .then(function (compra) {
            res.status(200).json(compra);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const compraID = req.params.id;

    comprasService.findCompraById(compraID)
        .then(function (compra) {
            res.status(200).json(compra);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findManyByIdUser(req, res) {
    const userID = req.params.idUser;
    comprasService.findManyByIdUser(userID)
        .then(function (compras) {
            res.status(200).json(compras);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function remove(req, res) {
    const compraID = req.params.id;

    comprasService.remove(compraID)
        .then(function (compra) {
            if (compra) {
                res.status(200).json(compra);
                // req.socketClient.emit('locationsList', { location })
            } else {
                res
                    .status(404)
                    .json({ message: `La compra con id ${compra} no existe` });
            }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function update(req, res) {
    const compraID = req.params.id;
    const data = req.body;

    comprasService.update(compraID, data)
        .then(function (compra) {
            res.status(201).json(compra);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

// async function savePurchase(req, res) {
//     const data = req.body;
//     const cart = await carritoService.findByIdUser(data.idUser);
//     comprasService.update(compraID, data)
//         .then(function (compra) {
//             res.status(201).json(compra);
//         })
//         .catch(function (err) {
//             res.status(500).json({ err });
//         });
// }


export default {
    create,
    find,
    findById,
    findManyByIdUser,
    remove,
    update,
    // savePurchase
}