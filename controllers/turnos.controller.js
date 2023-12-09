import * as turnosServices from "../services/turnos.service.js"


async function create(req, res) {
    const newTurno = req.body;

    await turnosServices.create(newTurno)
        .then(function (newTurno) {
            res.status(201).json(newTurno);
            // req.socketClient.emit('newLocation', { newLocation })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function find(req, res) {
    turnosServices.find()
        .then(function (turno) {
            res.status(200).json(turno);
            // req.socketClient.emit('locationsList', { turno })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const turnoId = req.params.idTurnos;
    turnosServices.findTurnoById(turnoId)
    .then(function (turno) {
        res.status(200).json(turno);
    })
    .catch(function (err) {
        res.status(500).json({ err });
    });
}

async function findByCurso(req, res) {
    const cursoId = req.params.idCurso;

    turnosServices.findByCurso(cursoId)
        .then(function (turno) {
            res.status(200).json(turno);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function remove(req, res) {
    const turnoId = req.params.idTurnos;

    turnosServices.remove(turnoId)
        .then(function (turno) {
            if (turno) {
                res.status(200).json(turno);
                // req.socketClient.emit('locationsList', { location })
            } else {
                res
                    .status(404)
                    .json({ message: `El alumno con id ${turno} no existe` });
            }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function update(req, res) {
    const turnoId = req.params.idTurnos;
    const data = req.body;

    turnosServices.update(turnoId, data)
        .then(function (turno) {
            res.status(201).json(turno);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


export default {
    create,
    find,
    findById,
    findByCurso,
    remove,
    update
}