import path from 'path';

export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : 'Debe ingresar un email válido.';
}

export function validatePassword(password) {
    // Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(password) ? null : 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.';
}

export function validateDNI(dni) {
    const dniRegex = /^\d{7,8}$/;
    return dniRegex.test(dni) ? null : 'El DNI solo puede tener 7 u 8 números.';
}

export function validatePassport(passport) {
    const passportRegex = /^[A-Z0-9]{6,9}$/i;
    return passportRegex.test(passport) ? null : 'Debe ingresar un Pasaporte válido.';
}

export function validateCUIL(cuil) {
    const cuilRegex = /^\d{2}-\d{8}-\d{1}$/;
    return cuilRegex.test(cuil) ? null : 'Debe ingresar un CUIL válido, con el formato XX-XXXXXXXX-X.';
}

export function validateDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date) ? null : 'La fecha debe tener el formato DD/MM/AAAA.';
}

export function validateTime(time) {
    const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time) ? null : 'La hora debe tener el formato hh:mm (24 horas).';
}

export function validateImage(file, fileTypes = null) {
    if (!file) {
        return 'La imagen es requerida.'
    }
    const filetypes = fileTypes ?? /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // console.log(String(filetypes).replace(/\//g, '').replace('|', ', '))
    return (mimetype && extname) ? null : `El archivo debe ser de tipo ${String(filetypes).replace(/\//g, '').replace('|', ', ')}.`
}