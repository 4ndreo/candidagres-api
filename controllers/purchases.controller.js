import * as purchasesService from "../services/purchases.service.js"
import { validateDate } from "../utils/validators.js";
// async function create(req, res) {
//     const carrito = req.body;
//     const products = req.body.productos;
//     let productosDetalle = [];
//     await productsService.findMultipleById(products.map(producto => producto.id)).then((data) => {
//         productosDetalle = data;
//         products.forEach((producto, index) => {
//             products[index] = {
//                 ...products[index],
//                 ...productosDetalle.find(x => x._id.equals(producto.id))
//             };
//         })
//     });

//     carrito.created_at = new Date();

//     await purchasesService.create(carrito)
//         .then(function (response) {
//             res.status(201).json(response);
//         })
//         .catch(function (err) {
//             res.status(500).json({ err });
//         });
// }


async function find(req, res) {
    purchasesService.find()
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findQuery(req, res) {
    purchasesService.findQuery(req.query)
        .then(function (producto) {
            res.status(200).json(producto);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const purchaseId = req.params.id;

    purchasesService.findById(purchaseId)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findManyByIdUser(req, res) {
    const userId = req.params.id
    purchasesService.findManyByIdUser(userId)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function setDelivered(req, res) {
    const purchaseId = req.params.id;
    const data = req.body;
    const newErrors = {};


    const allowedFields = [
        "delivered_at",
    ];

    Object.keys(data).forEach((field) => {
        if (!allowedFields.includes(field)) {
            delete data[field];
        }
    })

    if (validateDate(data.delivered_at)) newErrors.delivered_at = validateDate(data.delivered_at)

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }

    purchasesService.update(purchaseId, data)
        .then(function (response) {
            res.status(201).json(response);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
        //TODO: Send email confiming delivery to final user
}

// async function remove(req, res) {
//     const purchaseId = req.params.id;

//     purchasesService.remove(purchaseId)
//         .then(function (compra) {
//             if (compra) {
//                 res.status(200).json(compra);
//                 // req.socketClient.emit('locationsList', { location })
//             } else {
//                 res
//                     .status(404)
//                     .json({ message: `La compra con id ${compra} no existe` });
//             }
//         })
//         .catch(function (err) {
//             res.status(500).json({ err });
//         });
// }


// async function update(req, res) {
//     const purchaseId = req.params.id;
//     const data = req.body;

//     purchasesService.update(purchaseId, data)
//         .then(function (res) {
//             res.status(201).json(res);
//         })
//         .catch(function (err) {
//             res.status(500).json({ err });
//         });
// }




export default {
    // create, // Commented because is not in use
    find,
    findQuery,
    findById,
    findManyByIdUser,
    setDelivered,
    // remove, // Commented because is not in use, purchases shouldn't be deleted
    // update, // Commented because is not in use, purchases shouldn't be updated
}