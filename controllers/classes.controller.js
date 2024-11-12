import jwt from "jsonwebtoken";
import * as classesService from "../services/classes.service.js"
import { ObjectId } from "mongodb";

async function create(req, res) {
    const incomingToken = req.headers["auth-token"];
    const user = jwt.verify(incomingToken, process.env.JWT_SECRET);

    const classData = { ...req.body, price: Number(req.body.price), min_age: Number(req.body.min_age) };
    const newErrors = {};

    if (classData.title?.length <= 0 || !classData.title) newErrors.title = 'Debe completar el título.';
    if (classData.teacher?.length <= 0 || !classData.teacher) newErrors.teacher = 'Debe completar el docente.';
    if (classData.description?.length <= 0 || classData.description?.length > 256  || !classData.description) newErrors.description = 'La descripción debe tener entre 1 y 255 caracteres.';
    if (isNaN(classData.price) || classData.price < 0) newErrors.price = 'Debe ingresar un precio mayor o igual a 0.';
    if (isNaN(classData.min_age) || classData.min_age < 0) newErrors.min_age = 'Debe ingresar un número mayor o igual a 0.';

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }

    await classesService.create({ ...classData, created_by: new ObjectId(user.id) })
        .then(function (resp) {
            res.status(201).json(resp);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function find(req, res) {
    classesService.find()
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findQuery(req, res) {
    const incomingToken = req.headers["auth-token"];
    const user = jwt.verify(incomingToken, process.env.JWT_SECRET);

    classesService.findQuery(req.query, user.role === 1 ? null : user.id)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const idClass = req.params.id;

    classesService.findCursoById(idClass)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findOneWithShifts(req, res) {
    const idClass = req.params.id;

    classesService.findOneWithShifts(idClass)
        .then(function (data) {
            res.status(200).json(data[0]);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function remove(req, res) {
    const idClass = req.params.id;

    classesService.remove(idClass)
        .then(function (data) {
            if (data) {
                res.status(200).json(data);
                // req.socketClient.emit('locationsList', { location })
            } else {
                res
                    .status(404)
                    .json({ message: `El alumno con id ${data} no existe` });
            }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function update(req, res) {
    const idClass = req.params.id;
    const classData = req.body;

    // Format
    if (typeof classData.title !== 'undefined') classData.title = String(req.body.title);
    if (typeof classData.teacher !== 'undefined') classData.teacher = String(req.body.teacher);
    if (typeof classData.description !== 'undefined') classData.description = String(req.body.description);
    if (typeof classData.price !== 'undefined') classData.price = Number(req.body.price);
    if (typeof classData.min_age !== 'undefined') classData.min_age = Number(req.body.min_age);

    // Validate
    const newErrors = {};

    if (typeof classData.title !== 'undefined' && classData.title?.length <= 0) newErrors.title = 'Debe completar el título.';
    if (typeof classData.teacher !== 'undefined' && classData.teacher?.length <= 0) newErrors.teacher = 'Debe completar el docente.';
    if (typeof classData.description !== 'undefined' && (classData.description?.length <= 0 || classData.description?.length > 256)) newErrors.description = 'La descripción debe tener entre 1 y 255 caracteres.';
    if (typeof classData.price !== 'undefined' && (isNaN(classData.price) || classData.price < 0)) newErrors.price = 'Debe ingresar un número mayor o igual a 0.';
    if (typeof classData.min_age !== 'undefined' && (isNaN(classData.min_age) || classData.min_age < 0)) newErrors.min_age = 'Debe ingresar un número mayor o igual a 0.';

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }

    classesService.update(idClass, classData)
        .then(function (data) {
            res.status(201).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


export default {
    create,
    find,
    findQuery,
    findById,
    findOneWithShifts,
    remove,
    update
}