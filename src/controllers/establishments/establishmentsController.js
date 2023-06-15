import Establishments from "../../models/Establishments.js";
import ApiResponse from "../../models/ApiResponse.js";
import Validators from "../../utils/utils.js";
import NotFoundError from "../errors/NotFoundError.js";

class EstablishmentsController {
  static async findAll(req, res, next) {
    try {
      let query = req.query;
      req.query = Establishments.find(query, { ownerId: 0 });
      next();
    } catch (e) {
      next(e);
    }
  }

  static async findOne(req, res, next) {
    try {
      const param = req.params;
      let data = await Establishments.findById(param.id, { ownerId: 0 });
      if (!data) {
        throw new NotFoundError("Estabelecimento não localizado");
      }
      return ApiResponse.returnSucess(data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async add(req, res, next) {
    try {
      let est = new Establishments(req.body);
      await est.save();
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async del(req, res, next) {
    try {
      if (!Validators.checkField(req.body.id)) {
        return ApiResponse.parameterNotFound('id').sendResponse(res);
      }
      await Establishments.findByIdAndDelete(req.body.id)
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async manageStore(req, res, next) {
    try {
      const {id, data, movement} = req.body;
      if (!Validators.checkField(id)) {
        return ApiResponse.parameterNotFound('id').sendResponse(res);
      } 
      if (!Validators.checkField(data)) {
        return ApiResponse.parameterNotFound('data').sendResponse(res);
      }
      if (!(Validators.checkField(movement) && !(movement != "pull" && movement != "push"))) {
        return ApiResponse.parameterNotFound('movement').sendResponse(res);
      }
      const process = movement == "push" ? {
        $push: {"stores": data},
      } : {
        $pull: {"stores": {
          "_id": data._id
        }},
      }
      await Establishments.findByIdAndUpdate(id, process)
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }
}

export default EstablishmentsController;
