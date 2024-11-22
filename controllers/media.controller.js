import cloudinary from "../config/cloudinaryConfig.cjs";
import { saveImage, remove } from "../services/media.service.js";
import { validateImage } from "../utils/validators.js";
// import clou}

async function uploadImagen(req, res) {

    const newErrors = {};

    if (validateImage(req.file)) newErrors.img = validateImage(req.file);

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }

    const buffer = req.file.buffer.toString('base64');

    cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${buffer}`, { folder: '' }, (error, result) => {
        if (error) {
            return res.status(500).json({ err: newErrors });
        }

        return res.status(201).json({ result });
    });
}

async function removeImage(req, res) {

    const fileName = req.params.name;
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