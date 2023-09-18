import Users from "../../models/Users.js";
import ApiResponse from "../../models/ApiResponse.js";
import TokenGenerator from "../../utils/tokenGenerator.js";
import PassGenerator from "../../utils/passGenerator.js";
import Validators from "../../utils/utils.js";
import NotFoundError from "../errors/NotFoundError.js";
import InvalidParameters from "../errors/InvalidParameter.js";
import mongoose from "mongoose";
var ObjectId = mongoose.Types.ObjectId;

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
        throw new InvalidParameters("id");
      }
      if (!Validators.checkField(data)) {
        throw new InvalidParameters("data");
      }
      await Users.findByIdAndUpdate(id, {
        isActive: data.isActive,
        group_user: data.group_user,
        username: data.username,
        establishments: data.establishments
      });
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async updatePass(req, res, next) {
    try {
      const {activePassword, id, pass} = req.body;
      if (!Validators.checkField(activePassword)) {
        throw new InvalidParameters("activePassword");
      }
      if (!Validators.checkField(id)) {
        throw new InvalidParameters("id");
      }
      if (!Validators.checkField(pass)) {
        throw new InvalidParameters("pass");
      }
      const activePass = new PassGenerator(activePassword).build();
      const user = await Users.findOne({
        _id: new ObjectId(id),
        pass: activePass
      }).lean();
      if (!user) {
        throw new NotFoundError("Dados inválidos ou incorretos.");
      }
      await Users.findByIdAndUpdate(id, {
        pass: new PassGenerator(pass).build()
      });
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
      const user = await Users.findById(id);
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
      const {storeCode, group_user, username} = req.query;
      const query = {};
      if (Validators.checkField(storeCode)) {
        query.establishments = {
          $in: [new ObjectId(storeCode)]
        }
      }
      if (Validators.checkField(group_user)) {
        query.group_user = group_user;
      }
      if (Validators.checkField(username)) {
        query.username = username;
      }
      req.query = Users.find(query).select({
        pass: 0
      }).populate("establishments");
      next();
    } catch (e) {
      next(e);
    }
  }

  static async authenticate(req, res, next) {
    try {
      const {email, password, token} = req.body;
      if (!Validators.checkField(email)) {
        throw new InvalidParameters("email");
      }
      if (!Validators.checkField(password)) {
        return ApiResponse.parameterNotFound('password').sendResponse(res);
      }
      const hashPass = new PassGenerator(password).build();
      let users = await Users.findOne({
        email: email,
        pass: hashPass,
      }).select({
        pass: 0
      }).populate("establishments");
      if (!users) {
        throw new NotFoundError("Dados incorretos ou inválidos.")
      } else {
        const authToken = TokenGenerator.generate(email);
        res.set("Authorization", authToken);
        res.set("Access-Control-Expose-Headers", "*");
        if (token && users.token != token) {
          await updateUserToken(users.id, token)
        }
        return ApiResponse.returnSucess(users).sendResponse(res);
      }
    } catch (e) {
      next(e);
    }
  }
}

async function updateUserToken(id, token) {
  await Users.findByIdAndUpdate(id, {
    "token": token
  })
}

export default UserController;
