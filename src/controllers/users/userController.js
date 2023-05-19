import Users from "../../models/Users.js";
import Establishments from "../../models/Establishments.js";
import ApiResponse from "../../models/ApiResponse.js";
import TokenGenerator from "../../utils/tokenGenerator.js";
import PassGenerator from "../../utils/passGenerator.js";
import Validators from "../../utils/utils.js";
import NotFoundError from "../errors/NotFoundError.js";

class UserController {
  static add = (req, res, next) => {
    let user = new Users(req.body);
    user.pass = new PassGenerator(user.pass).build();
    user.save((err, users) => {
      if (err) {
        next(err);
      } else {
        ApiResponse.returnSucess(users).sendResponse(res);
      }
    });
  };

  static delete = (req, res, next) => {
    let id = req.body.id;
    Users.findByIdAndDelete(id, (err) => {
      if (err) {
        next(err);
      } else {
        ApiResponse.returnSucess().sendResponse(res);
      }
    });
  };

  static update = (req, res, next) => {
    let body = req.body;
    Users.findByIdAndUpdate(body.id, { $set: body.data }, (err) => {
      if (err) {
        next(err);
      } else {
        ApiResponse.returnSucess().sendResponse(res);
      }
    });
  };

  static findAll = async (req, res, next) => {
    try {
      const users = await Users.find(req.query);
      if (!users) {
        throw new NotFoundError("Busca não localizou dados");
      }
      return ApiResponse.returnSucess(users).sendResponse(res);
    } catch (e) {
      next(e);
    }
  };

  static async authenticate(req, res, next) {
    try {
      let body = req.body;
      if (!Validators.checkField(body.email)) {
        return ApiResponse.parameterNotFound('email').sendResponse(res);
      }
      if (!Validators.checkField(body.password)) {
        return ApiResponse.parameterNotFound('password').sendResponse(res);
      }
      const hashPass = new PassGenerator(body.password).build();
      let users = await Users.findOne({
        _id: body.email,
        pass: hashPass,
      }).select({
        _id: 0,
        pass: 0
      })
      if (!users) {
        throw new NotFoundError("Dados incorretos ou inválidos.")
      } else {
        let ests = await Establishments.find({_id: {$in: users.establishments}})
        users.ests = ests;
        // users.pass = "";
        const token = TokenGenerator.generate(body.email);
        res.set("Authorization", token);
        res.set("Access-Control-Expose-Headers", "*");
        return ApiResponse.returnSucess(users).sendResponse(res);
      }
    } catch (e) {
      next(e);
    }
  }
}

export default UserController;
