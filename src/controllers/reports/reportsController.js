import mongoose from "mongoose";
import ApiResponse from "../../models/ApiResponse.js";
import TotalSales from "../../models/reports/Sales.js";
import Validators from "../../utils/utils.js";
import NotFoundError from "../errors/NotFoundError.js";
import InvalidParameter from "../errors/InvalidParameter.js";
import Orders from "../../models/Orders.js";
import Products from "../../models/Product.js";
import PeriodGenerator from "../../utils/periodGenerator.js";

var ObjectId = mongoose.Types.ObjectId;

class ReportsControllers {
  static async quantifySales(req, res, next) {
    try {
      let { storeCode, from, to, saller, type, product } = req.query;
      let query = {};
      if (!Validators.checkField(storeCode)) {
        throw new InvalidParameter('storeCode');
      }
      query.storeCode = new ObjectId(storeCode);
      if (Validators.checkField(from) && Validators.checkField(to)) {
        query.createDate = new PeriodGenerator(from, to).buildQuery();
      }
      if (Validators.checkField(saller)) {
        query.userCreate = new ObjectId(saller);
      }
      if (Validators.checkField(type)) {
        query.orderType = type;
      }
      if (Validators.checkField(product)) {
        query.products = {
          $elemMatch: {
            productId: {
              $in: product.map((e) => new ObjectId(e)),
            },
          },
        };
      }
      query.status = {
        $ne: "cancelled",
      };
      const sales = await TotalSales.aggregate([
        {
          $match: query,
        },
        {
          $project: {
            total: {
              $sum: {
                $map: {
                  input: {
                    $range: [
                      0,
                      {
                        $size: "$products",
                      },
                    ],
                  },
                  as: "ix",
                  in: {
                    $let: {
                      in: {
                        $multiply: ["$$pre", "$$cal"],
                      },
                      vars: {
                        pre: {
                          $arrayElemAt: ["$products.quantity", "$$ix"],
                        },
                        cal: {
                          $arrayElemAt: ["$products.unitPrice", "$$ix"],
                        },
                      },
                    },
                  },
                },
              },
            },
            createDate: 1,
            storeCode: 1,
            pedidosId: 1,
            orderType: 1,
            // products: 1,
          },
        },
      ]);
      if (!sales) {
        throw new NotFoundError("Busca não localizou dados");
      } else {
        let totalValue = 0;
        let data = {};
        for (let i = 0; i < sales.length; i++) {
          totalValue += sales[i].total;
        }
        data.totalValue = totalValue;
        data.orders = sales.map((e) => e);
        return ApiResponse.returnSucess(data).sendResponse(res);
      }
    } catch (e) {
      next(e);
    }
  }

  static async quantifySalesByProduct(req, res, next) {
    try {
      let { storeCode, from, to, saller, type, product, category,} = req.query;
      let query = {};
      if (!Validators.checkField(storeCode)) {
        throw new InvalidParameter("storeCode");
      }
      query.storeCode = storeCode;
      if (Validators.checkField(from) && Validators.checkField(to)) {
        query.createDate = new PeriodGenerator(from, to).buildQuery();
      }
      if (Validators.checkField(saller)) {
        query.userCreate = new ObjectId(saller);
      }
      if (Validators.checkField(type)) {
        query.orderType = type;
      }
      if (!Validators.checkField(product) && !Validators.checkField(category)) {
        const prods = await getProducts(storeCode);
        const prodList = prods.map((e) => e._id);
        query.products = {
          $elemMatch: {
            productId: {
              $in: prodList
            }
          }
        }
        product = prodList.map((e) => e.toString());
      } else if (Validators.checkField(product) && !Validators.checkField(category)) {
        const isList = (typeof product) == 'object';
        query.products = {
          $elemMatch: {
            productId: {
              $in: isList ? product.map((e) => new ObjectId(e)) : new ObjectId(product),
            },
          },
        };
      } 
      if (Validators.checkField(category)) {
        const getProdList = await getProductsFromCategory(category);
        const prodList = getProdList.map((e) => e._id);
        query.products = {
          $elemMatch: {
            productId: {
              $in: prodList
            }
          }
        }
        product = prodList.map((e) => e.toString());
      }
      query.status = {
        $ne: "cancelled",
      };
      // query.isPayed = true;
      const orders = await Orders.find(query)
        .select({
          products: 1
        })
        .lean();
      const data = prepareData(orders, product);
      const total = getTotal(data);
      return ApiResponse.returnSucess({
        total: total,
      }).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }
}

async function getProductsFromCategory(category) {
  const isList = (typeof category) == 'object';
  const query = isList ? {
    isActive: true,
    category: {$in: category.map((e) => {new ObjectId(e)})}
  } : {category: new ObjectId(category), isActive: true}
  const products = await Products.find(query).select({
    _id: 1
  }).lean();
  return products;
}

async function getProducts(storeCode) {
  return await Products.find({storeCode: new ObjectId(storeCode)}).lean();
}

function prepareData(orders, product) {
  let data = [];
  orders.forEach((order) => {
    let or = {};
    let prods = [];
    or.order = order._id;
    order.products.forEach((prod) => {
      if (product.includes(prod.productId.toString())) {
        prods.push(prod);
      }
    });
    or.products = prods;
    data.push(or);
  });
  return data;
}

function getTotal(data) {
  return data.reduce(
    (total, value) =>
      total +
      value.products.reduce((tot, vl) => tot + vl.quantity * vl.unitPrice, 0),
    0
  );
}

export default ReportsControllers;
