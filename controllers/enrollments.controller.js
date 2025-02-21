import jwt from "jsonwebtoken";
import * as enrollmentsService from "../services/enrollments.service.js"
import * as shiftsService from "../services/shifts.service.js"
import { ObjectId } from "mongodb";

async function create(req, res) {
    const incomingToken = req.headers["auth-token"];
    const userData = jwt.verify(incomingToken, process.env.JWT_SECRET);
    const shiftData = await shiftsService.findOneWithEnrollments(new ObjectId(req.body.id_shift))
    const hasEnrollment = await enrollmentsService.filter({ id_shift: new ObjectId(req.body.id_shift), id_user: new ObjectId(userData.id) })

    if (shiftData[0]?.max_places <= shiftData[0]?.enrollments.length) return res.status(400).json({ err: { max_places: 'No hay cupos disponibles para esta comisión.' } });

    const enrollmentData = { ...req.body, id_user: new ObjectId(userData.id), id_shift: new ObjectId(req.body.id_shift) };
    const newErrors = {};

    const allowedFields = [
        "id_shift",
        "id_user"
    ];

    Object.keys(enrollmentData).forEach((field) => {
        if (!allowedFields.includes(field)) {
            delete enrollmentData[field];
        }
    })

    if (!shiftData) newErrors.id_shift = 'La comisión no existe.';
    if (!userData) newErrors.id_user = 'El usuario no existe.';

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }
    if (hasEnrollment.length > 0) {
        enrollmentsService.update(hasEnrollment[0]._id, { deleted: false })
            .then(function (data) {
                return res.status(201).json(data);
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

    enrollmentsService.findQuery(req.query, user.role === 1 ? null : user.id)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findOwn(req, res) {
    const incomingToken = req.headers["auth-token"];
    const user = jwt.verify(incomingToken, process.env.JWT_SECRET);

    req.query.filter = `[{"field":"id_user","value":"${user.id}"}]`

    enrollmentsService.findOwn(req.query)
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
    const userID = req.params.id;

    enrollmentsService.findByUser(userID)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


async function remove(req, res) {
    const incomingToken = req.headers["auth-token"];
    const userData = jwt.verify(incomingToken, process.env.JWT_SECRET);
    const enrollmentId = req.params.id;
    const enrollment = await enrollmentsService.findById(new ObjectId(enrollmentId))
    if(!enrollment.id_user.equals(userData.id) && userData.role !== 1) return res.status(403).json({ err: 'No tenés permisos para realizar esta acción' });

    enrollmentsService.remove(enrollmentId)
        .then(function (data) {
            if (data) {
                res.status(200).json({ message: `La inscripción con id ${enrollmentId} se ha eliminado` });
            } else {
                res.status(404).json({ message: `La inscripción con id ${enrollmentId} no existe` });
            }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


// async function update(req, res) {

//     const idEnrollment = req.params.id;
//     const incomingToken = req.headers["auth-token"];
//     const userData = jwt.verify(incomingToken, process.env.JWT_SECRET);

//     const enrollmentData = { ...req.body, id_user: new ObjectId(userData.id) };
//     const enrollment = await enrollmentsService.findById(new ObjectId(idEnrollment))
//     const shiftData = await shiftsService.findOneWithEnrollments(new ObjectId(req.body.id_shift))

//     const allowedFields = [
//         "id_shift",
//         "id_user",
//         "deleted"
//     ];

//     Object.keys(enrollmentData).forEach((field) => {
//         if (!allowedFields.includes(field)) {
//             delete enrollmentData[field];
//         }
//     })

//     // Format
//     if (typeof enrollmentData.id_shift !== 'undefined') enrollmentData.id_shift = new ObjectId(req.body.id_shift);
//     if (typeof enrollmentData.deleted !== 'undefined') enrollmentData.deleted = Boolean(req.body.deleted);

//     // Validate
//     const newErrors = {};

//     if (!enrollment) newErrors.enrollment = 'La inscripción no existe.';
//     if (typeof enrollmentData.id_shift !== 'undefined' && !shiftData) newErrors.id_shift = 'La comisión no existe.';
//     if (typeof enrollmentData.id_user !== 'undefined' && !userData) newErrors.id_user = 'El usuario no existe.';

//     if ((
//         (enrollment?.deleted === true && typeof enrollmentData.deleted !== 'undefined' && enrollmentData.deleted === false) ||
//         (String(enrollment?.id_shift) !== req.body.id_shift)
//     )
//         && (shiftData[0].max_places <= shiftData[0].enrollmentsCount)) return res.status(403).json({ err: 'No hay cupos disponibles para esta comisión.' });

//     if (Object.keys(newErrors).length !== 0) {
//         return res.status(400).json({ err: newErrors });
//     }

//     enrollmentsService.update(idEnrollment, enrollmentData)
//         .then(function (inscripcion) {
//             res.status(201).json(inscripcion);
//         })
//         .catch(function (err) {
//             res.status(500).json({ err });
//         });
// }


export default {
    find,
    findQuery,
    findOwn,
    findById,
    findByUser,
    create,
    // update,
    remove,
}