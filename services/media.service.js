import fs from 'node:fs';
import path from 'node:path';

async function saveImage(file) {
    const ext = path.extname(file.originalname)
    const newPath = `./uploads/${file.filename + ext}`;
    fs.renameSync(file.path, newPath);
    return `${file.filename + ext}`;
}

async function remove(fileName) {
    // const ext = path.extname(file);
    const imagePath = `./uploads/${fileName}`;
    fs.unlinkSync(imagePath);
    return `${fileName}`
}

export {
    saveImage,
    remove
}