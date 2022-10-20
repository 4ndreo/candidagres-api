import * as cursosService from "../services/cursos.service.js"




async function create(req, res) {
    const newCurso = req.body;

    await cursosService.create(newCurso)
        .then(function (newCurso) {
            res.status(201).json(newCurso);
            // req.socketClient.emit('newLocation', { newLocation })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function find(req, res) {
    cursosService.find()
        .then(function (curso) {
            res.status(200).json(curso);
            // req.socketClient.emit('locationsList', { turno })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const cursoID = req.params.idCursos;

    cursosService.findCursoById(cursoID)
        .then(function (curso) {
            res.status(200).json(curso);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function remove(req, res) {
    const cursoID = req.params.idCursos;

    cursosService.remove(cursoID)
        .then(function (curso) {
            if (curso) {
                res.status(200).json(curso);
                // req.socketClient.emit('locationsList', { location })
            } else {
                res
                    .status(404)
                    .json({ message: `El alumno con id ${curso} no existe` });
            }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function update(req, res) {
    const cursoID = req.params.idCursos;
    const data = req.body;

    cursosService.update(cursoID, data)
        .then(function (curso) {
            res.status(201).json(curso);
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