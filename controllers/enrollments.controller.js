import jwt from "jsonwebtoken";
import * as enrollmentsService from "../services/enrollments.service.js"
import * as shiftsService from "../services/shifts.service.js"
import { ObjectId } from "mongodb";

async function create(req, res) {
    const incomingToken = req.headers["auth-token"];
    const userData = jwt.verify(incomingToken, process.env.JWT_SECRET);
    const shiftData = await shiftsService.findOneWithEnrollments(new ObjectId(req.body.id_shift))
    const hasEnrollment = await enrollmentsService.filter({ id_shift: new ObjectId(req.body.id_shift), id_user: new ObjectId(userData.id), deleted: true })

    if (shiftData[0]?.max_places <= shiftData[0]?.enrollmentsCount) return res.status(403).json({ err: { max_places: 'No hay cupos disponibles para esta comisión.' } });

    const enrollmentData = { ...req.body, id_user: new ObjectId(userData.id), id_shift: new ObjectId(req.body.id_shift) };
    const newErrors = {};

    if (!shiftData) newErrors.id_shift = 'La comisión no existe.';
    if (!userData) newErrors.id_user = 'El usuario no existe.';

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }
    if (hasEnrollment.length > 0) {
        enrollmentsService.update(hasEnrollment[0]._id, { deleted: false })
            .then(function (inscripcion) {
                return res.status(201).json(inscripcion);
            })
            .catch(function (err) {
                return res.status(500).json({ err });
            });
    } else {

        await enrollmentsService.create(enrollmentData)
            .then(function (resp) {
                return res.status(201).json(resp);
            })
            .catch(function (err) {
                return res.status(500).json({ err });
            });
    }
}

async function find(req, res) {
    enrollmentsService.find()
        .then(function (inscripcion) {
            res.status(200).json(inscripcion);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findQuery(req, res) {
    const incomingToken = req.headers["auth-token"];
    const user = jwt.verify(incomingToken, process.env.JWT_SECRET);

    enrollmentsService.findQuery(req.query, user.role === 1 ? null : user.id)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const enrollmentID = req.params.id;

    enrollmentsService.findById(enrollmentID)
        .then(function (enrollment) {
            res.status(200).json(enrollment);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findByUser(req, res) {
    const userID = req.params.idUser;

    enrollmentsService.findByUser(userID)
        .then(function (inscripcion) {
            res.status(200).json(inscripcion);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findAllByUser(req, res) {
    const userID = req.params.idUser;
    enrollmentsService.findAllByUser(userID)
        .then(function (inscripcion) {
            res.status(200).json(inscripcion);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}
// async function findAllByUserAndTurno(req, res) {
//     const idUser = req.params.idUser;
//     const idShift = req.params.id;
//     enrollmentsService.findAllByUserAndTurno(idUser, idShift)
//         .then(function (inscripcion) {
//             res.status(200).json(inscripcion);
//         })
//         .catch(function (err) {
//             res.status(500).json({ err });
//         });
// }

async function remove(req, res) {
    const enrollmentID = req.params.id;

    enrollmentsService.remove(enrollmentID)
        .then(function (enrollment) {
            if (enrollment) {
                res.status(200).json(enrollment);
                // req.socketClient.emit('locationsList', { location })
            } else {
                res
                    .status(404)
                    .json({ message: `La inscripción con id ${enrollment} no existe` });
            }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function update(req, res) {

    const idEnrollment = req.params.id;
    const incomingToken = req.headers["auth-token"];
    const userData = jwt.verify(incomingToken, process.env.JWT_SECRET);

    const enrollmentData = { ...req.body, id_user: new ObjectId(userData.id) };
    const enrollment = await enrollmentsService.findById(new ObjectId(idEnrollment))
    const shiftData = await shiftsService.findOneWithEnrollments(new ObjectId(req.body.id_shift))


    // Format
    if (typeof enrollmentData.id_shift !== 'undefined') enrollmentData.id_shift = new ObjectId(req.body.id_shift);
    if (typeof enrollmentData.deleted !== 'undefined') enrollmentData.deleted = Boolean(req.body.deleted);

    // Validate
    const newErrors = {};

    if (!enrollment) newErrors.enrollment = 'La inscripción no existe.';
    if (typeof enrollmentData.id_shift !== 'undefined' && !shiftData) newErrors.id_shift = 'La comisión no existe.';
    if (typeof enrollmentData.id_user !== 'undefined' && !userData) newErrors.id_user = 'El usuario no existe.';

    if ((
        (enrollment?.deleted === true && typeof enrollmentData.deleted !== 'undefined' && enrollmentData.deleted === false) ||
        (String(enrollment?.id_shift) !== req.body.id_shift)
    )
        && (shiftData[0].max_places <= shiftData[0].enrollmentsCount)) return res.status(403).json({ err: 'No hay cupos disponibles para esta comisión.' });

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }

    enrollmentsService.update(idEnrollment, enrollmentData)
        .then(function (inscripcion) {
            res.status(201).json(inscripcion);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function countEnrollmentsByCurso(req, res) {
    const cursoId = req.params.idCurso;

    enrollmentsService.countEnrollmentsByCurso(cursoId)
        .then(function (agg) {
            res.status(201).json(agg);
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
    findAllByUser,
    // findAllByUserAndTurno,
    findByUser,
    remove,
    update,
    countEnrollmentsByCurso,
}