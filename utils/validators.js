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