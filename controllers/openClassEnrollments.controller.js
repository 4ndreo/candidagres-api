import * as openClassEnrollmentsService from "../services/openClassEnrollments.service.js"
import { validateEmail, validateTime } from "../utils/validators.js";


async function create(req, res) {
    const enrollmentData = req.body;
    const newErrors = {};
    const allowedFields = [
        "email",
        "day",
        "shift_start_time",
    ];

    Object.keys(enrollmentData).forEach((field) => {
        if (!allowedFields.includes(field)) {
            delete enrollmentData[field];
        }
    })

    if (validateEmail(enrollmentData.email)) newErrors.email = validateEmail(enrollmentData.email);
    if (["Sábado", "Domingo"].some(elem => elem === enrollmentData.day) ? null : 'Debe ingresar un día válido.') newErrors.day = ["Sábado", "Domingo"].some(elem => elem === enrollmentData.day) ? null : 'Debe ingresar un día válido.';
    if (validateTime(enrollmentData.shift_start_time)) newErrors.shift_start_time = validateTime(enrollmentData.shift_start_time);


    const userOld = await openClassEnrollmentsService.findOneByEmail(enrollmentData.email)
    if (userOld) newErrors.email = 'Ya te inscribiste en la clase abierta.'

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors, enrollmentData: userOld, enrolled: !!userOld });
    }

    await openClassEnrollmentsService.create(enrollmentData)
        .then(function (data) {
            res.status(201).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}



export default {
    create,
}