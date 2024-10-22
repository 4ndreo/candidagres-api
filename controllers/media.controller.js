import { saveImage, remove } from "../services/media.service.js";
import { validateImage } from "../utils/validators.js";

async function uploadImagen(req, res) {
    const newErrors = {};

    if (validateImage(req.file)) newErrors.img = validateImage(req.file);

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }

    saveImage(req.file).then((data) => {
        return res.status(201).json(data);
    }).catch(function (err) {
        res.status(500).json({ err });
    });
}

async function removeImage(req, res) {
    const fileName = req.params.name;
    console.log('entre', fileName)
    remove(fileName).then((data) => {
        return res.status(200).json(data);
    }).catch(function (err) {
        res.status(500).json({ err });
    })
}

export default {
    uploadImagen,
    removeImage
}