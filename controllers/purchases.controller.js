import * as purchasesService from "../services/purchases.service.js"
import { validateDate } from "../utils/validators.js";

async function find(req, res) {
    purchasesService.find()
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findQuery(req, res) {
    purchasesService.findQuery(req.query)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findById(req, res) {
    const purchaseId = req.params.id;

    purchasesService.findById(purchaseId)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function findManyByIdUser(req, res) {
    const userId = req.params.id
    purchasesService.findManyByIdUser(userId)
        .then(function (data) {
            res.status(200).json(data);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function setDelivered(req, res) {
    const purchaseId = req.params.id;
    const data = req.body;
    const newErrors = {};


    const allowedFields = [
        "delivered_at",
    ];

    Object.keys(data).forEach((field) => {
        if (!allowedFields.includes(field)) {
            delete data[field];
        }
    })

    if (validateDate(data.delivered_at)) newErrors.delivered_at = validateDate(data.delivered_at)

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }

    purchasesService.update(purchaseId, data)
        .then(function (response) {
            res.status(201).json(response);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
        //TODO: Send email confiming delivery to final user
}

export default {
    find,
    findQuery,
    findById,
    findManyByIdUser,
    setDelivered,
    // create, // Removed because is not in use
    // update, // Removed because is not in use, purchases shouldn't be updated
    // remove, // Removed because is not in use, purchases shouldn't be deleted
}