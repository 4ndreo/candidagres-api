import { saveImage, remove } from "../services/media.service.js";

async function uploadImagen(req, res) {
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