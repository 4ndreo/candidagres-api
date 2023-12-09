import * as comprasFinalizadasService from "../services/compras.finlaizadas.service.js"




async function create(req, res) {
    const newCompraFinalizada = req.body;

    await comprasFinalizadasService.create(newCompraFinalizada)
        .then(function (newCompraFinalizada) {
            // console.log(newProducto)
            res.status(201).json(newCompraFinalizada);
            // req.socketClient.emit('newLocation', { newLocation })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function find(req, res) {
    comprasFinalizadasService.find()
        .then(function (compraFinalizada) {
            res.status(200).json(compraFinalizada);
            // req.socketClient.emit('locationsList', { turno })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const compraFinalizadaID = req.params.idCompras;

    comprasFinalizadasService.findCompraFinalizadaById(compraFinalizadaID)
        .then(function (compraFinalizada) {
            res.status(200).json(compraFinalizada);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function remove(req, res) {
    const compraFinalizadaID = req.params.idCompras;

    comprasFinalizadasService.remove(compraFinalizadaID)
        .then(function (compraFinalizada) {
            if (compraFinalizada) {
                res.status(200).json(compraFinalizada);
                // req.socketClient.emit('locationsList', { location })
            } else {
                res
                    .status(404)
                    .json({ message: `El alumno con id ${compraFinalizada} no existe` });
            }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function update(req, res) {
    const compraFinalizadaID = req.params.idCompras;
    const data = req.body;

    comprasFinalizadasService.update(compraFinalizadaID, data)
        .then(function (compraFinalizada) {
            res.status(201).json(compraFinalizada);
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