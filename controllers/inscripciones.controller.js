import * as inscripcionesService from "../services/inscripciones.service.js"



async function create(req, res) {
    const newInscripcion = req.body;

    await inscripcionesService.create(newInscripcion)
        .then(function (newInscripcion) {
            res.status(201).json(newInscripcion);
            // req.socketClient.emit('newLocation', { newLocation })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function find(req, res) {
    inscripcionesService.find()
        .then(function (inscripcion) {
            res.status(200).json(inscripcion);
            // req.socketClient.emit('locationsList', { turno })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const inscripcionID = req.params.idInscripciones;

    inscripcionesService.findInscripcionById(inscripcionID)
        .then(function (inscripcion) {
            res.status(200).json(inscripcion);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function remove(req, res) {
    const inscripcionID = req.params.idInscripciones;

    inscripcionesService.remove(inscripcionID)
        .then(function (inscripcion) {
            if (inscripcion) {
                res.status(200).json(inscripcion);
                // req.socketClient.emit('locationsList', { location })
            } else {
                res
                    .status(404)
                    .json({ message: `La inscripcion con id ${inscripcion} no existe` });
            }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function update(req, res) {
    const inscripcionID = req.params.idInscripciones;
    const data = req.body;

    inscripcionesService.update(inscripcionID, data)
        .then(function (inscripcion) {
            res.status(201).json(inscripcion);
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