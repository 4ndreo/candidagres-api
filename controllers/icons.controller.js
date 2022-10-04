import * as IconsServices from "../services/icons.service.js";

export function find(req, res) {
  IconsServices.find().then(function (icons) {
    res.status(200).json(icons);
  });
}

async function findById(req, res) {
  const id = req.params.idIcon;

  IconsServices.findIconById(id)
    .then(function (icon) {
      res.status(200).json(icon);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function create(req, res) {
  const newIcon = req.body;

  await IconsServices.create(newIcon)
    .then(function (newIcon) {
      res.status(201).json(newIcon);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function remove(req, res) {
  const id = req.params.idIcon;

  IconsServices.remove(id)
    .then(function (icon) {
      if (icon) {
        res.status(200).json(icon);
      } else {
        res.status(404).json({ message: `El icono con id ${id} no existe` });
      }
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function update(req, res) {
  const id = req.params.idIcon;
  const icon = req.body;

  IconsServices.update(id, icon)
    .then(function (newIcon) {
      res.status(201).json( newIcon );
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

export default {
  find,
  findById,
  create,
  update,
  remove,
};
