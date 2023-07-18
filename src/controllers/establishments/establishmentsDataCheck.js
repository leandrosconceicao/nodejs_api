import EstablishmentCheck from "../../models/establishments/dataCheck.js";
import mongoose from "mongoose";
var ObjectId = mongoose.Types.ObjectId;

export default {
  async check(id) {
    const check = EstablishmentCheck.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "storeCode",
          as: "products",
          pipeline: [
            {
              $match: {
                storeCode: new ObjectId(id),
              },
            },
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "storeCode",
          as: "orders",
          pipeline: [
            {
              $match: {
                storeCode: new ObjectId(id),
              },
            },
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "storeCode",
          as: "payments",
          pipeline: [
            {
              $match: {
                storeCode: new ObjectId(id),
              },
            },
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "accounts",
          localField: "_id",
          foreignField: "storeCode",
          as: "accounts",
          pipeline: [
            {
              $match: {
                storeCode: new ObjectId(id),
              },
            },
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "storeCode",
          as: "categories",
          pipeline: [
            {
              $match: {
                storeCode: new ObjectId(id),
              },
            },
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $project: {
          products: 1,
          orders: 1,
          payments: 1,
          accounts: 1,
          categories: 1,
          _id: 0,
        },
      },
    ]);
    return check;
  },
};
