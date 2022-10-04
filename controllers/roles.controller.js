import * as RoleService from "../services/roles.service.js";

async function find(req, res) {
  RoleService.find()
    .then(function (location) {
      res.status(200).json(location);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function findById(req, res) {
  const roleId = req.params.idRole;

  RoleService.findRoleById(roleId)
    .then(function (role) {
      res.status(200).json(role);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function create(req, res) {
  const newRole = req.body;

  await RoleService.create(newRole)
    .then(function (role) {
      res.status(201).json(role);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function remove(req, res) {
  const roleId = req.params.idRole;

  RoleService.remove(roleId)
    .then(function (role) {
      if (role) {
        res.status(200).json(role);
      } else {
        res.status(404).json({ message: `El alumno con id ${role} no existe` });
      }
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function update(req, res) {
  const roleId = req.params.idRole;
  const data = req.body;

  RoleService.update(roleId, data)
    .then(function (role) {
      res.status(201).json( role );
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

export default {
  find,
  findById,
  create,
  remove,
  update,
};
