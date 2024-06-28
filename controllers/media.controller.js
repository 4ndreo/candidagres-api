import { saveImage } from "../services/media.service.js";

async function uploadImagen(req, res) {
    saveImage(req.file).then((data) => {
        return res.status(201).json(data);
    }).catch(function (err) {
        res.status(500).json({ err });
    });
}

export default {
    uploadImagen
}