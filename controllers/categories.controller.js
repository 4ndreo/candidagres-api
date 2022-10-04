import * as CategoriesServices from "../services/categories.service.js";

export function find(req, res) {
  CategoriesServices.find().then(function (categories) {
    res.status(200).json(categories);
  });
}

async function findById(req, res) {
  const id = req.params.idCategory;

  CategoriesServices.findCategoryById(id)
    .then(function (category) {
      res.status(200).json(category);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function create(req, res) {
  const newCategory = req.body;

  await CategoriesServices.create(newCategory)
    .then(function (newCategory) {
      res.status(201).json(newCategory);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function remove(req, res) {
  const id = req.params.idCategory;

  CategoriesServices.remove(id)
    .then(function (category) {
      if (category) {
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: `El alumno con id ${id} no existe` });
      }
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function update(req, res) {
  const id = req.params.idCategory;
  const category = req.body;

  CategoriesServices.update(id, category)
    .then(function (newCategoria) {
      res.status(201).json( newCategoria );
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
