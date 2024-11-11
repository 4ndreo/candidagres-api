import  cloudinary  from "../config/cloudinaryConfig.cjs";
import { saveImage, remove } from "../services/media.service.js";
import { validateImage } from "../utils/validators.js";
// import clou}

async function uploadImagen(req, res) {

    // TODO: remove previous image from cloudinary
    const newErrors = {};

    if (validateImage(req.file)) newErrors.img = validateImage(req.file);

    if (Object.keys(newErrors).length !== 0) {
        return res.status(400).json({ err: newErrors });
    }

    const buffer = req.file.buffer.toString('base64');

    cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${buffer}`, { folder: 'profile' }, (error, result) => {
        if (error) {
          return res.status(500).json({ err: newErrors });
        }
    
        return res.status(201).json({ result });
      });

    // saveImage(req.file).then((data) => {
    //     return res.status(201).json(data);
    // }).catch(function (err) {
    //     res.status(500).json({ err });
    // });
}

async function removeImage(req, res) {

    // TODO: Remove image from cloudinary

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