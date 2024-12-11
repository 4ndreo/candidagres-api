import { MongoClient, ObjectID, ObjectId, ServerApiVersion } from "mongodb";
import { promise } from "bcrypt/promises.js";

let client;
let uri = '';
let db;

async function connectDB(action) {
  uri = process.env.DB_URI;
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1, keepAlive: true });
    //const client = new MongoClient("mongodb://127.0.0.1:27017");
    db = client.db("cgres-app-turnos");
  }

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

async function findQuery(collection, request, idUser = null, relations = []) {
  try {
    const sort = (request?.sort ?? 'undefined') !== 'undefined' ? JSON.parse(request?.sort) : {}
    const sortField = (sort?.field ?? 'undefined') !== 'undefined' ? ('$' + sort.field) : null
    const sortDirection = (sort?.direction ?? 'undefined') !== 'undefined' ? parseInt(sort.direction) : 1
    const page = (request?.page ?? 'undefined') !== 'undefined' ? parseInt(request.page) : 0
    const limit = (request?.limit ?? 'undefined') !== 'undefined' ? parseInt(request.limit) : 10
    const filters = (request?.filter ?? 'undefined') !== 'undefined' ? JSON.parse(request?.filter).filter(filter => (filter.field ?? 'undefined') !== 'undefined' && (filter.value ?? 'undefined') !== 'undefined') : null

    const pipeline = [
      {
        $addFields: {
          sortField: {
            // For future reference: Test date sorting
            // $cond: [
            //   { $eq: [{ $type: "$lowerName" }, "date"] },
            //   { $toLong: "$lowerName" },
            //   {
            //     $cond: [
            //       { $isNumber: "$lowerName" },
            //       "$lowerName",
            //       { $toLower: { $toString: "$lowerName" } }
            //     ]
            //   }
            // ]
            $cond: {
              if: { $isNumber: sortField },
              then: sortField,
              else: { $toLower: { $toString: sortField } }
            }
          }
        }
      },

    ]
    relations.forEach((relation) => {
      const lookupPipeline = [{
        $lookup:
        {
          from: relation.from,
          localField: relation.localField,
          foreignField: relation.foreignField,
          as: relation.as
        }
      },
      {
        $unwind: {
          path: `\$${relation.as}`,
          preserveNullAndEmptyArrays: true
        }
      },
      ]

      pipeline.push(...lookupPipeline)
    })

    filters?.forEach((filter) => {
      const filterPipeline = [{
        $match:
          filter.field.includes('id_') ?
            {
              [filter.field]: { $eq: new ObjectID(filter.value) }
            } :
            {
              [filter.field]: { $regex: filter.value, $options: "i" }
            }
      }]

      if (filter.field && filter.value) {
        pipeline.push(...filterPipeline)
      }
    })

    pipeline.push(
      // filter the results
      {
        $match:
          idUser ?
            {
              created_by: { $eq: new ObjectID(idUser) }
            } : {}
      },
      {
        $match:
        {
          deleted: { $not: { $eq: true } },

        }
      },

      // sort the results
      { $sort: { sortField: sortDirection } },
    )

    pipeline.push(
      // count the results on stage1, and paginate on stage2
      {
        $facet: {

          "stage1": [{ "$group": { _id: null, count: { $sum: 1 } } }],

          "stage2": [{ "$skip": page }, { "$limit": limit }]

        }
      },

      { $unwind: "$stage1" },

      //output projection
      {
        $project: {
          count: "$stage1.count",
          data: "$stage2",
          pages: { $ceil: { $divide: ["$stage1.count", limit] } }
        }
      })
    return connectDB((db) =>
      db
        .collection(collection)
        .aggregate(pipeline)
        .toArray()
    );
  } catch (e) {
    console.log(e)
  }
}

async function findOneRelated(collection, id, relation, subrelation = null) {

  const unwindRelationName = `\$${relation.as}`
  const unwindSubrelationDestination = `\$${subrelation?.as}`
  const relationCount = `${relation.as}Count`
  const subrelationCount = `${subrelation?.as}Count`

  const pipeline = [
    {
      $match: { _id: new ObjectId(id), deleted: false }
    },
    {
      $lookup: {
        from: relation.from, localField: relation.localField, foreignField: relation.foreignField, as: relation.as
        , pipeline: [{ $match: { deleted: false } }]
      }
    },
    {
      $unwind: {
        path: unwindRelationName,
        preserveNullAndEmptyArrays: true
      }
    },
  ]
  try {

    if (subrelation) {
      pipeline.push(
        {
          $lookup: {
            from: subrelation.from, localField: subrelation.localField, foreignField: subrelation.foreignField, as: subrelation.as
          }
        },
        {
          $addFields: {
            [subrelationCount]: {
              $size:
              {
                $filter: {
                  input: unwindSubrelationDestination,
                  as: "item",
                  cond: { $eq: ["$$item.deleted", false] }
                }
              }
            },
          }
        },
      );
    }
    pipeline.push(
      {
        $group: {
          "_id": "$_id",
          "details": { "$first": "$$ROOT" },
          [relation.from]: { "$push": `\$${relation.from}` },
          [relationCount]: { "$sum": 1 }
        }
      },
      {
        $replaceRoot: {
          "newRoot": {
            "$mergeObjects": [
              "$details",
              {
                [relation.from]: `\$${relation.from}`,
                [relationCount]: `\$${relationCount}`
              }
            ]
          }
        }
      },
    )
  } catch (error) {
    console.log('error', error)
  }

  return connectDB((db) =>
    db
      .collection(collection)
      .aggregate(pipeline)
      .toArray()
  );
}

async function findRelated(collection, from, localField, foreignField, as) {
  return connectDB((db) =>
    db
      .collection(collection)
      .aggregate([{ $lookup: { from: from, localField: localField, foreignField: foreignField, as: as } }])
      .toArray()
  );
}

async function create(collection, data) {
  return connectDB((db) =>
    // db.collection(collection).insertOne({ id_user: id_user, productos: [], deleted: false })
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
    db.collection(collection).findOne({ id_user: id, deleted: false })
  );
}

async function findManyByIdUser(collection, id) {
  return connectDB((db) => db.collection(collection).find({ id_user: id, deleted: false }).sort({ created_at: -1 }).toArray());
}

async function findByIdUserFinalizado(collection, id) {
  return connectDB(async (db) => {
    const cursor = await db.collection(collection).find({ id_user: id, deleted: true });
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

async function findOne(collection, field, value) {
  return connectDB((db) => db.collection(collection).findOne({ [field]: value }));
}

async function findOneByEmail(collection, email) {

  return connectDB((db) => db.collection(collection).findOne({ email: email }));
}

// async function countInscripcionesByCurso(collection, idCurso) {
//   return connectDB((db) => db
//     .collection(collection)
//     .aggregate([
//       {
//         $match: { idCurso: idCurso, deleted: false }
//       },
//       {
//         $group: { _id: "$idTurno", totalQuantity: { $sum: 1 } }
//       }
//     ]).toArray());
// }

async function closeDB() {
  client.close();
}

export {
  connectDB,
  find,
  findQuery,
  findOneRelated,
  findRelated,
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
  findOne,
  findOneByEmail,
  // countInscripcionesByCurso,
};
