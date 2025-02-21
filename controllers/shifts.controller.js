import jwt from "jsonwebtoken";
import * as shiftsServices from "../services/shifts.service.js"
import * as classesService from "../services/classes.service.js"
import { validateInteger, validateTime, validateWeekday } from "../utils/validators.js";
import { ObjectId } from "mongodb";


async function create(req, res) {
    const shiftData = { ...req.body, max_places: Number(req.body.max_places), id_class: req.body.id_class.length > 0 ? new ObjectId(req.body.id_class) : undefined };
    const classData = await classesService.findCursoById(shiftData.id_class)
    const newErrors = {};

    const allowedFields = [
        "title",
        "description",
        "id_class",
        "start_time",
        "end_time",
        "max_places",
        "days",
    ];

    Object.keys(shiftData).forEach((field) => {
        if (!allowedFields.includes(field)) {
            delete shiftData[field];
        }
    })

    if (!classData) newErrors.id_class = 'La clase no existe.';
    if (shiftData.title?.length <= 0 || !shiftData.title) newErrors.title = 'Debe completar el título.';
    if (validateTime(shiftData.start_time)) newErrors.start_time = validateTime(shiftData.start_time);
    if (validateTime(shiftData.end_time)) newErrors.end_time = validateTime(shiftData.end_time);
    if (shiftData.description?.length <= 0 || shiftData.description?.length > 256 || !shiftData.description) newErrors.description = 'La descripción debe tener entre 1 y 255 caracteres.';
    if (isNaN(shiftData.max_places) || !shiftData.max_places || validateInteger(shiftData.max_places)) newErrors.max_places = validateInteger(shiftData.max_places);
    if (isNaN(shiftData.max_places) || !shiftData.max_places || shiftData.max_places < 1) newErrors.max_places = 'Debe ingresar un número mayor o igual a 1.';
    if (!shiftData.days || shiftData.days.length < 1) newErrors.days = 'Debe ingresar los días en los que se dará la clase.';
    shiftData?.days?.forEach((day) => { if (validateWeekday(day)) newErrors.days = 'Debe ingresar un día válido.'; })

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }

    await shiftsServices.create(shiftData)
        .then(function (resp) {
            res.status(201).json(resp);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });

}


async function find(req, res) {
    shiftsServices.find()
        .then(function (shift) {
            res.status(200).json(shift);
            // req.socketClient.emit('locationsList', { shift })
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findQuery(req, res) {
    const incomingToken = req.headers["auth-token"];
    const user = jwt.verify(incomingToken, process.env.JWT_SECRET);

    shiftsServices.findQuery(req.query, user.role === 1 ? null : user.id)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const shiftId = req.params.id;
    shiftsServices.findById(shiftId)
        .then(function (shift) {
            res.status(200).json(shift);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findOneWithEnrollments(req, res) {
    const idShift = req.params.id;

    shiftsServices.findOneWithEnrollments(idShift)
        .then(function (data) {
            res.status(200).json(data[0]);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findByCurso(req, res) {
    const cursoId = req.params.idCurso;

    shiftsServices.findByCurso(cursoId)
        .then(function (shift) {
            res.status(200).json(shift);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function remove(req, res) {
    const shiftId = req.params.id;

    shiftsServices.remove(shiftId)
        .then(function (data) {
            if (data) {
                res.status(200).json({ message: `La comisión con id ${shiftId} se ha eliminado` });
            } else {
                res.status(404).json({ message: `La comisión con id ${shiftId} no existe` });
            }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function update(req, res) {

    const idShift = req.params.id;
    const shiftData = req.body;
    const classData = await classesService.findCursoById(new ObjectId(req.body.id_class))

    const allowedFields = [
        "title",
        "description",
        "id_class",
        "start_time",
        "end_time",
        "max_places",
        "days",
    ];

    Object.keys(shiftData).forEach((field) => {
        if (!allowedFields.includes(field)) {
            delete shiftData[field];
        }
    })

    // Format
    if (typeof shiftData.title !== 'undefined') shiftData.title = String(req.body.title);
    if (typeof shiftData.id_class !== 'undefined') shiftData.id_class = new ObjectId(req.body.id_class);
    if (typeof shiftData.description !== 'undefined') shiftData.description = String(req.body.description);
    if (typeof shiftData.start_time !== 'undefined') shiftData.start_time = String(req.body.start_time);
    if (typeof shiftData.end_time !== 'undefined') shiftData.end_time = String(req.body.end_time);
    if (typeof shiftData.max_places !== 'undefined') shiftData.max_places = Number(req.body.max_places);
    if (typeof shiftData.days !== 'undefined') shiftData.days = req.body.days.map(day => String(day))

    // Validate
    const newErrors = {};

    if (typeof shiftData.id_class !== 'undefined' && !classData) newErrors.id_class = 'La clase no existe.';
    if (typeof shiftData.title !== 'undefined' && shiftData.title?.length <= 0) newErrors.title = 'Debe completar el título.';
    if (typeof shiftData.description !== 'undefined' && (shiftData.description?.length <= 0 || shiftData.description?.length > 256)) newErrors.description = 'La descripción debe tener entre 1 y 255 caracteres.';
    if (typeof shiftData.start_time !== 'undefined' && validateTime(shiftData.start_time)) newErrors.start_time = validateTime(shiftData.start_time);
    if (typeof shiftData.end_time !== 'undefined' && validateTime(shiftData.end_time)) newErrors.end_time = validateTime(shiftData.end_time);
    if (typeof shiftData.max_places !== 'undefined' && (isNaN(shiftData.max_places) || validateInteger(shiftData.max_places))) newErrors.max_places = validateInteger(shiftData.max_places);
    if (typeof shiftData.max_places !== 'undefined' && (isNaN(shiftData.max_places) || shiftData.max_places < 1)) newErrors.max_places = 'Debe ingresar un número mayor o igual a 1.';
    if (typeof shiftData.days !== 'undefined' && (!shiftData.days || shiftData.days.length < 1)) newErrors.days = 'Debe ingresar los días en los que se dará la clase.';
    shiftData?.days?.forEach((day) => { if (validateWeekday(day)) newErrors.days = 'Debe ingresar un día válido.'; })

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }

    shiftsServices.update(idShift, shiftData)
        .then(function (shift) {
            res.status(201).json(shift);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


export default {
    create,
    find,
    findOneWithEnrollments,
    findById,
    findQuery,
    findByCurso,
    remove,
    update
}