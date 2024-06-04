import * as comprasService from "../services/compras.service.js"

async function create(req, res) {
    const newCompra = req.body;

    await comprasService.create(newCompra)
        .then(function (newCompra) {
            res.status(201).json(newCompra);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function find(req, res) {
    comprasService.find()
        .then(function (compra) {
            res.status(200).json(compra);
            // req.socketClient.emit('locationsList', { turno })
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
                    .json({ message: `El alumno con id ${compra} no existe` });
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


export default {
    create,
    find,
    findById,
    remove,
    update
}