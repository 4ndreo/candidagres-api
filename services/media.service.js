import fs from 'node:fs';
import path from 'node:path';

async function saveImage(file) {
    const ext = path.extname(file.originalname)
    const newPath = `./uploads/${file.filename + ext}`;
    fs.renameSync(file.path, newPath);
    return `${file.filename + ext}`;
}

export {
    saveImage
}