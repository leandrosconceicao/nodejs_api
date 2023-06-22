import mongoose from "mongoose";
import ApiResponse from "../../models/ApiResponse.js";
import TotalSales from "../../models/reports/Sales.js";
import Validators from "../../utils/utils.js";
import NotFoundError from "../errors/NotFoundError.js";
import InvalidParameter from "../errors/InvalidParameter.js";
import Orders from "../../models/Orders.js";
import Products from "../../models/Product.js";

var ObjectId = mongoose.Types.ObjectId;

class ReportsControllers {
  static async quantifySales(req, res, next) {
    try {
      let { storeCode, from, to, saller, type, product } = req.query;
      let or = {};
      if (!Validators.checkField(storeCode)) {
        return ApiResponse.parameterNotFound("storeCode").sendResponse(res);
      } else {
        or.storeCode = storeCode;
      }
      if (Validators.checkField(from) && Validators.checkField(to)) {
        or.createDate = { $gte: new Date(from), $lte: new Date(to) };
      }
      if (Validators.checkField(saller)) {
        or.userCreate = saller;
      }
      if (Validators.checkField(type)) {
        or.orderType = type;
      }
      if (Validators.checkField(product)) {
        or.products = {
          $elemMatch: {
            productId: {
              $in: product.map((e) => new ObjectId(e)),
            },
          },
        };
      }
      or.status = {
        $ne: "cancelled",
      };
      const sales = await TotalSales.aggregate([
        {
          $match: or,
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
            orderType: 1,
            products: 1,
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
        data.orders = sales;
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
        query.createDate = { $gte: new Date(from), $lte: new Date(to) };
      }
      if (Validators.checkField(saller)) {
        query.userCreate = saller;
      }
      if (Validators.checkField(type)) {
        query.orderType = type;
      }
      if (Validators.checkField(product) && !Validators.checkField(category)) {
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
        product = prodList.map((e) => e.toString())
      }
      query.status = {
        $ne: "cancelled",
      };
      query.isPayed = true;
      const orders = await Orders.find(query)
        .select({
          products: 1,
          payment: 1,
        })
        .lean();
      const data = prepareData(orders, product);
      const total = getTotal(data);
      const totalPay = getTotalPay(data);
      const forms = getForms(data);
      const diff = getTotalDiff(data);
      const filterOrders = data.map((e) => {
        delete e.diffPay;
        return e;
      })
      return ApiResponse.returnSucess({
        total: total,
        totalPay: totalPay,
        difference: diff,
        payments: forms,
        orders: filterOrders,
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

function prepareData(orders, product) {
  let data = [];
  orders.forEach((order) => {
    let or = {};
    let prods = [];
    let diffPay = [];
    or.order = order._id;
    or.payment = order.payment;
    order.products.forEach((prod) => {
      if (product.includes(prod.productId.toString())) {
        prods.push(prod);
      } else {
        diffPay.push(prod.quantity * prod.unitPrice);
      }
    });
    or.diffPay = diffPay;
    or.products = prods;
    data.push(or);
  });
  return data;
}

function getForms(data) {
  let debit = [];
  let credit = [];
  let money = [];
  let pix = [];
  data.map((e) => e.payment).forEach((pay) => {
    debit.push(...pay.values.filter((e) => e.form == 'debit'));
    credit.push(...pay.values.filter((e) => e.form == 'credit'));
    money.push(...pay.values.filter((e) => e.form == 'money'));
    pix.push(...pay.values.filter((e) => e.form == 'pix'));
  })
  return {
    debit: {
      total: getValues(debit),
      payments: debit
    },
    credit: {
      total: getValues(credit),
      payments: credit
    },
    money: {
      total: getValues(money),
      payments: money
    },
    pix: {
      total: getValues(pix),
      payments: pix
    }
  };
}

function getValues(data) {
  return data.reduce((total, element) => total + (element.value), 0);
}

function getTotalDiff(data) {
  return data.reduce(
    (total, value) => total + value.diffPay.reduce((tot, vl) => tot + vl, 0),
    0
  );
}

function getTotal(data) {
  return data.reduce(
    (total, value) =>
      total +
      value.products.reduce((tot, vl) => tot + vl.quantity * vl.unitPrice, 0),
    0
  );
}

function getTotalPay(data) {
  return data.reduce(
    (total, value) =>
      total + value.payment.values.reduce((tot, vl) => tot + vl.value, 0),
    0
  );
}

export default ReportsControllers;
