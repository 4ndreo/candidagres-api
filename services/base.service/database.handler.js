import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { promise } from "bcrypt/promises.js";

let client = '';
let uri = '';

async function connectDB(action) {
  uri = process.env.DB_URI;
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1, keepAlive: true });
  //const client = new MongoClient("mongodb://127.0.0.1:27017");

  const db = await client.db("cgres-app-turnos");
  let response;
  try {
    await client.connect().catch(() => {
      console.error(`No me pude conectar a ${db.namespace}`);
    });
    response = await action(db);
  } catch (error) {
    console.error(error);
    response = Promise.reject({ message: error.toString() })
  } finally {
    // await client.close();
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
    // db.collection(collection).insertOne({ usuarioId: usuarioId, productos: [], deleted: false })
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

async function updateCarrito(collection, id, items) {
  return connectDB((db) =>
    db
      .collection(collection)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { items: items } }
      )
  );
}
async function updateCarritoActualizado(collection, id, { total, productosComprar }) {
  return connectDB((db) =>
    db
      .collection(collection)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { total, productosComprar } }
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

async function findMultipleById(collection, ids) {
  return connectDB(async (db) => {
    const cursor = await db.collection(collection).find({ _id: { "$in": ids.map(id => new ObjectId(id)) } });
    const results = await cursor.toArray();
    return results;
  }
  );
}

async function findByIdUser(collection, id) {
  return connectDB((db) =>
    db.collection(collection).findOne({ usuarioId: id, deleted: false })
  );
}

async function findManyByIdUser(collection, id) {
  return connectDB((db) => db.collection(collection).find({ usuarioId: id, deleted: false, state: "approved" }).sort({ created_at: -1 }).toArray());
}

async function findByIdUserFinalizado(collection, id) {
  return connectDB(async (db) => {
    const cursor = await db.collection(collection).find({ usuarioId: id, deleted: true });
    const results = await cursor.toArray();
    return results;
  });
}
async function findByIdCarrito(collection, id) {
  return connectDB((db) =>
    db.collection(collection).findOne({ _id: new ObjectId(id), deleted: false })
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
  
  return connectDB((db) => db.collection(collection).findOne({email: email}));
}

async function countInscripcionesByCurso(collection, idCurso) {
  return connectDB((db) => db
    .collection(collection)
    .aggregate([
      {
        $match: { idCurso: idCurso, deleted: false }
      },
      {
        $group: { _id: "$idTurno", totalQuantity: { $sum: 1 } }
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
  updateCarritoActualizado,
  remove,
  findById,
  findMultipleById,
  findByIdUser,
  findManyByIdUser,
  findByIdUserFinalizado,
  findByIdCarrito,
  filter,
  closeDB,
  parseToObjectId,
  findOne,
  findOneByEmail,
  countInscripcionesByCurso,
};
