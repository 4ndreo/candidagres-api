import * as FavoritesService from "../services/favorites.service.js";

export function find(req, res) {
    const userId = req.user.id;
    console.log(req.user);
    FavoritesService.find(userId).then(function (favorite) {
        res.status(200).json(favorite);
    });
}



async function create(req, res) {
    const newFavorite = {
        userId: req.user.id,
        locationId: req.params.locationid
    }

    await FavoritesService.create(newFavorite)
        .then(function (newFavorite) {
            res.status(201).json(newFavorite);
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}

async function remove(req, res) {
    const id = req.params.idFavorite;

    FavoritesService.remove(id)
        .then(function (favorite) {
            if (favorite) {
                res.status(200).json(favorite);
            } else {
                res.status(404).json({ message: `El alumno con id ${id} no existe` });
            }
        })
        .catch(function (err) {
            res.status(500).json({ err });
        });
}


export default {
    find,
    create,
    remove,
};
