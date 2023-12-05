import { MongoClient, ObjectId,ServerApiVersion } from "mongodb";
import {promise} from "bcrypt/promises.js";
 const uri = "mongodb+srv://admin:1234@cgres-back.fe4sygh.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// const client = new MongoClient("mongodb://127.0.0.1:27017");

async function connectDB(action) {
  // const client = new MongoClient("mongodb://127.0.0.1:27017");
  const db = await client.db("cgres-app-turnos");
  let response;
  try {
    await client.connect().catch(() => {
      console.log(`No me pude conectar a ${db.namespace}`);
    });
    response = await action(db);
  } catch (error) {
    console.log(error);
    // response = { message: error.toString() };
    response = Promise.reject({message: error.toString()})
  } finally {
    await client.close();
  }
  return response;
}

async function find(collection) {
  return connectDB((db) =>
    db
      .collection(collection)
      .find({ deleted: { $not: { $eq: true } } })
      .toArray()
  );
}

async function create(collection, data) {
  return connectDB((db) =>
    db.collection(collection).insertOne({ ...data, deleted: false })
  );
}

async function update(collection, id, data) {
  return connectDB((db) =>
    db
      .collection(collection)
      .updateOne({ _id: new ObjectId(id) }, { $set: data })
  );
}

async function updateCarrito(collection, id, { total, productosComprar }) {
  return connectDB((db) =>
      db
          .collection(collection)
          .updateOne(
              { _id: new ObjectId(id) },
              { $set: { total }, $push: { productosComprar } }
          )
  );
}

async function remove(collection, id) {
  return connectDB((db) =>
    db
      .collection(collection)
      .updateOne({ _id: new ObjectId(id) }, { $set: { deleted: true } })
  );
}

async function findById(collection, id) {
  return connectDB((db) =>
    db.collection(collection).findOne({ _id: new ObjectId(id) })
  );
}
async function findByIdUser(collection, id) {
  return connectDB((db) =>
    db.collection(collection).findOne({ usuarioId:id, deleted: false})
  );
}

async function filter(collection, filter) {
  return connectDB((db) => db.collection(collection).find(filter).toArray());
}

async function parseToObjectId(id) {
  return new ObjectId(id);
}

async function findOne(collection, email) {
  return connectDB((db) => db.collection(collection).findOne({ email }));
}

async function findOneByEmail(collection, email) {
  return connectDB((db) => db.collection(collection).findOne(email));
}

async function countInscripcionesByCurso(collection, idCurso) {
  return connectDB((db) => db
  .collection(collection)
  .aggregate([
    {
        $match: { idCurso: idCurso }
    },
    {
        $group: { _id:"$idTurno", totalQuantity:  {$sum: 1} }
    }
    ]).toArray());
}

async function closeDB() {
  client.close();
}

export {
  connectDB,
  find,
  create,
  update,
  updateCarrito,
  remove,
  findById,
  findByIdUser,
  filter,
  closeDB,
  parseToObjectId,
  findOne,
  findOneByEmail,
  countInscripcionesByCurso,
};
