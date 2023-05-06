import Users from "../../models/Users.js";
import Establishments from "../../models/Establishments.js";
import ApiResponse from "../../models/ApiResponse.js";
import TokenGenerator from "../../utils/tokenGenerator.js";
import PassGenerator from "../../utils/passGenerator.js";
import Validators from "../../utils/utils.js";

class UserController {
  static add = (req, res) => {
    let user = new Users(req.body);
    user.pass = new PassGenerator(user.pass).build();
    user.save((err, users) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(201).json(ApiResponse.returnSucess(users));
      }
    });
  };

  static delete = (req, res) => {
    let id = req.body.id;
    Users.findByIdAndDelete(id, (err) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess());
      }
    });
  };

  static update = (req, res) => {
    let body = req.body;
    Users.findByIdAndUpdate(body.id, { $set: body.data }, (err) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess());
      }
    });
  };

  static findAll = (req, res) => {
    Users.find(req.query, (err, users) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess(users));
      }
    });
  };

  static async authenticate(req, res) {
    try {
      let body = req.body;
      if (!Validators.checkField(body.email)) {
        return res.status(406).json(ApiResponse.parameterNotFound('(email)'));
      }
      if (!Validators.checkField(body.password)) {
        return res.status(406).json(ApiResponse.parameterNotFound('(password)'));
      }
      const hashPass = new PassGenerator(body.password).build();
      let users = await Users.findOne({
        _id: body.email,
        pass: hashPass,
      });
      if (!users) {
        return res.status(400).json(ApiResponse.returnError("Dados incorretos ou inválidos."));
      } else {
        let ests = await Establishments.find({_id: {$in: users.establishments}})
        users.ests = ests;
        const token = TokenGenerator.generate(body.email);
        res.set("Authorization", token);
        res.set("Access-Control-Expose-Headers", "*");
        return res.status(200).json(ApiResponse.returnSucess(users));
      }
    } catch (e) {
      return res.status(500).json(ApiResponse.unknownError(e));
    }
  }
}

export default UserController;
