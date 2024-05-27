import jwt from 'jsonwebtoken';
import * as InscripcionesService from '../services/inscripciones.service.js';
import * as TurnosService from '../services/turnos.service.js';
import * as CursosService from '../services/cursos.service.js';

const endpoint = {uri: '/api/inscripciones/', method: 'PATCH'};

async function verifyDeletionPatch(req, res, next) {
	const bodyKeys = Object.keys(req.body);
	const token = req.headers['auth-token'] || '';
	const user = jwt.verify(token, 'FARG');
	const idInscripcion = req.params.idInscripciones;
	let admin = isAdmin(user);
	const currentInscripcion = await InscripcionesService.findInscripcionById(
		idInscripcion
	).then((data) => data);
	const currentTurno = await TurnosService.findTurnoById(
		currentInscripcion.idTurno
	).then((data) => data);
	const totalInscripciones = await InscripcionesService.countInscripcionesByCurso(
		currentInscripcion.idCurso
	).then((data) => data);

	try {
		if (admin) {
			next();
		} else {
			// Verificar que sea una solicitud PATCH
			if (req.method === endpoint.method && req.url.includes(endpoint.uri)) {
				// Verificar que solo tenga la propiedad "deleted" en el cuerpo
				if (bodyKeys.length === 1 && bodyKeys[0] === 'deleted') {
					await currentInscripcion;
					await currentTurno;
					await totalInscripciones;
					if (currentInscripcion.idUser === user.id) {
            if(Object.values(req.body)[0]){
              next();
            } else if(totalInscripciones[0].totalQuantity < currentTurno.max_turnos) {
              next();
            } else {
              res.status(403).json({
                mensaje: 'No quedan cupos disponibles.',
              });
            }
          } else {
            res.status(403).json({
              mensaje: 'No autorizado.',
            });
          }
				} else {
					res.status(403).json({mensaje: 'Acción no permitida'});
				}
			} else {
				res.status(401).json({
					mensaje: 'Sin Autorización',
				});
			}
		}
	} catch (err) {
		res.status(401).json({mensaje: 'Sin Autorización'});
	}
}

async function isAllBooked(req, res, next) {
	const token = req.headers['auth-token'] || '';
	const user = jwt.verify(token, 'FARG');
	const currentTurno = await TurnosService.findTurnoById(
		req.body.idTurno
	).then((data) => data);
	const totalInscripciones = await InscripcionesService.countInscripcionesByCurso(
		req.body.idCurso
	).then((data) => data);
	let admin = isAdmin(user);
  try {
  if (admin) {
    next();
  } else {
    await currentTurno;
    await totalInscripciones;
    if(req.body.idUser === user.id) {
      if(totalInscripciones[0].totalQuantity < currentTurno.max_turnos) {
        next();
      } else {
        res.status(403).json({
          mensaje: 'No quedan cupos disponibles.',
        });
      }
    } else {
      res.status(401).json({
        mensaje: 'No autorizado.',
      });
    }
  }
}catch (err) {
		res.status(401).json({mensaje: 'Sin Autorización'});
	}
}

function isAdmin(user) {
	let verifyAdmin = user.role === 1 ? true : false;
	return verifyAdmin;
}

export {isAllBooked, verifyDeletionPatch};
