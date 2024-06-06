import jwt from "jsonwebtoken";
import * as UserService from "../services/users.service.js";
import bcrypt from 'bcrypt'

async function find(req, res) {
  UserService.find()
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function findById(req, res) {
  const userId = req.params.idUser;

  UserService.findUserById(userId)
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function create(req, res) {
  const user = req.body;

  const userOld = await UserService.findOneByEmail(user.email)

  if(!userOld){
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(user.password, salt)
    const newUser = {
      email: user.email,
      role: 2,
      password: passwordHash
    }
    await UserService.create(newUser)
      .then(function (user) {
        res.status(201).json(user);
      })
      .catch(function (err) {
        res.status(500).json({ err });
      });
    } else {
    res.status(500).json('El usuario ya existe.');
  }

}

async function remove(req, res) {
  const userId = req.params.idUser;

  UserService.remove(userId)
    .then(function (user) {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: `El alumno con id ${user} no existe` });
      }
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function update(req, res) {
  const userId = req.params.idUser;
  const data = req.body;

  UserService.update(userId, data)
    .then(function (user) {
      res.status(201).json(user);
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function login(req, res) {
  const user = req.body;
  UserService.login(user)
    .then((userData) => {
      const token = jwt.sign(
        { id: userData._id, email: userData.email, role: userData.role },
        "FARG"
      );
      //res.header('auth-token', token).status(200).json(user);
      res.status(200).json({
        userData,
        token,
      });
    })
    .catch(function (err) {
      res.status(500).json({ err });
    });
}

async function auth(req, res) {
  const incomingToken = req.headers["auth-token"];
  const user = req.body;
  UserService.auth(user)
    .then((userData) => {
      const token = jwt.sign(
        { id: userData._id, email: userData.email, role: userData.role },
        "FARG"
      );
      //res.header('auth-token', token).status(200).json(user);
      const userVerify1 = jwt.verify(incomingToken, "FARG");
      const userVerify2 = jwt.verify(token, "FARG");
      if (
        userVerify1.email === userVerify2.email &&
        userVerify1.role === userVerify2.role
      ) {
        res.status(200).json(userData);
      } else {
        const err = "No encontrado";
        res.status(404).json({ err });
      }
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
  login,
  auth,
};
