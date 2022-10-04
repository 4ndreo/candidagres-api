import * as LocationServices from "../services/locations.service.js";

async function find(req, res) {
  LocationServices.find()
    .then(function (location) {
      res.status(200).json(location);
      req.socketClient.emit('locationsList', { location })
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function findById(req, res) {
  const locationId = req.params.idLocation;

  LocationServices.findLocationById(locationId)
    .then(function (location) {
      res.status(200).json(location);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function findByCity(req, res) {
  const city = req.params.city;
  LocationServices.findLocationByCity({ city: city })
    .then(function (location) {
      res.status(200).json(location);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function create(req, res) {
  const newLocation = req.body;

  await LocationServices.create(newLocation)
    .then(function (newLocation) {
      res.status(201).json(newLocation);
      // req.socketClient.emit('newLocation', { newLocation })
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function remove(req, res) {
  const locationId = req.params.idLocation;

  LocationServices.remove(locationId)
    .then(function (location) {
      if (location) {
        res.status(200).json(location);
        req.socketClient.emit('locationsList', { location })
      } else {
        res
          .status(404)
          .json({ message: `El alumno con id ${location} no existe` });
      }
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function update(req, res) {
  const locationId = req.params.idLocation;
  const data = req.body;

  LocationServices.update(locationId, data)
    .then(function (location) {
      res.status(201).json(location);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

export default {
  find,
  findById,
  findByCity,
  create,
  remove,
  update,
};
