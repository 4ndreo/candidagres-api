import * as LocationRequestsServices from "../services/locationRequests.service.js";

async function find(req, res) {
  LocationRequestsServices.find()
    .then(function (locationRequest) {
      res.status(200).json(locationRequest);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function findById(req, res) {
  const locationRequestId = req.params.idLocationRequest;

  LocationRequestsServices.findLocationRequestById(locationRequestId)
    .then(function (locationRequest) {
      res.status(200).json(locationRequest);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function findByUser(req, res) {
  const locationRequestUser = req.params.idLocationRequestUser;

  LocationRequestsServices.findLocationRequestByUser(locationRequestUser)
    .then(function (locationRequest) {
      res.status(200).json(locationRequest);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function create(req, res) {
  const newLoc = req.body;

  await LocationRequestsServices.create(newLoc)
    .then(function (newLocation) {
      res.status(201).json(newLocation);
      req.socketClient.emit('sendNotification', { newLoc })
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function remove(req, res) {
  const locationRequestId = req.params.idLocationRequest;

  LocationRequestsServices.remove(locationRequestId)
    .then(function (locationRequest) {
      if (locationRequest) {
        res.status(200).json(locationRequest);
      } else {
        res
          .status(404)
          .json({ message: `El alumno con id ${locationRequest} no existe` });
      }
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function update(req, res) {
  const locationRequestId = req.params.idLocationRequest;
  const data = req.body;

  LocationRequestsServices.update(locationRequestId, data)
    .then(function (locationRequest) {
      res.status(201).json(locationRequest);
      req.socketClient.emit('locationsRequestListUpdated', locationRequest )
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

export default {
  find,
  findById,
  findByUser,
  create,
  remove,
  update,
};
