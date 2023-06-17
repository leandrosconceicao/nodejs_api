import Users from "../../models/Users.js";
// import Establishments from "../../models/Establishments.js";
import ApiResponse from "../../models/ApiResponse.js";
import TokenGenerator from "../../utils/tokenGenerator.js";
import PassGenerator from "../../utils/passGenerator.js";
import Validators from "../../utils/utils.js";
import NotFoundError from "../errors/NotFoundError.js";
import mongoose from "mongoose";

class UserController {
  static async add(req, res, next) {
    try {
      let user = new Users(req.body);
      user.pass = new PassGenerator(user.pass).build();
      const users = await user.save();
      return ApiResponse.returnSucess(users).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      let id = req.body.id;
      if (!Validators.checkField(id)) {
        return ApiResponse.parameterNotFound('id');
      }
      await Users.findByIdAndDelete(id);
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async update(req, res, next) {
    try {
      const {id, data} = req.body;
      if (!Validators.checkField(id)) {
        return ApiResponse.parameterNotFound('id').sendResponse(res);
      }
      if (!Validators.checkField(data)) {
        return ApiResponse.parameterNotFound('data').sendResponse(res);
      }
      await Users.findByIdAndUpdate(id, { $set: data });
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async findOne(req, res, next) {
    try {
      const id = req.params;
      if (!Validators.checkField(id)) {
        return ApiResponse.parameterNotFound('id').sendResponse(res);
      }
      const user = await Users.findById(new mongoose.Types.ObjectId('648b7cfa5cb22112500c499e'));
      if (!user) {
        throw new NotFoundError("Usuário não localizado");
      }
      return ApiResponse.returnSucess(user).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async findAll(req, res, next) {
    try {
      req.query = Users.find(req.query).select({
        pass: 0
      }).populate("establishments");
      next();
    } catch (e) {
      next(e);
    }
  }

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
        email: body.email,
        pass: hashPass,
      }).select({
        pass: 0
      }).populate("establishments");
      if (!users) {
        throw new NotFoundError("Dados incorretos ou inválidos.")
      } else {
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
