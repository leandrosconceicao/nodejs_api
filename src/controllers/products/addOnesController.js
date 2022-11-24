import AddOnes from "../../models/AddOnes.js";
import ApiResponse from "../../models/ApiResponse.js";
import TokenGenerator from "../../utils/tokenGenerator.js";
import Jwt from "jsonwebtoken";
import Validators from "../../utils/utils.js";

class AddOneController {
  static findAll = (req, res) => {
    let search = req.query;
    if (Validators.checkField(search.storeCode)) {
      AddOnes.find(search, (err, result) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(200).json(ApiResponse.returnSucess(result));
        }
      });
    } else {
      res.status(406).json(ApiResponse.parameterNotFound('(storeCode)'));
    }
  };

  static add = (req, res) => {
    try {
      TokenGenerator.verify(req.headers.authorization);
      let addOne = new AddOnes(req.body);
      addOne.save((err) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(201).json(ApiResponse.returnSucess());
        }
      });
    } catch (e) {
      if (e instanceof Jwt.JsonWebTokenError) {
        res.status(401).json(ApiResponse.unauthorized());
      } else {
        res.status(400).json(ApiResponse.returnError());
      }
    }
  };

  static update = (req, res) => {
    try {
      TokenGenerator.verify(req.headers.authorization);
      let id = req.body.id;
      let data = req.body.data;
      if (Validators.checkField(id) && Validators.checkField(data)) {
        console.log(data);
        AddOnes.findByIdAndUpdate(id, { $set: data }, (err) => {
          if (err) {
            res.status(500).json(ApiResponse.dbError(err));
          } else {
            res.status(200).json(ApiResponse.returnSucess());
          }
        });
      } else {
        res.status(406).json(ApiResponse.parameterNotFound(''))
      }
    } catch (e) {
      if (e instanceof Jwt.JsonWebTokenError) {
        res.status(401).json(ApiResponse.unauthorized());
      } else {
        res.status(400).json(ApiResponse.returnError());
      }
    }
  };

  static delete = (req, res) => {
    try {
      TokenGenerator.verify(req.headers.authorization);
      let addOne = req.body;
      if (Validators.checkField(addOne.id)) {
        AddOnes.findByIdAndDelete(addOne.id, (err, doc) => {
          if (err) {
            res.status(500).json(ApiResponse.dbError(err));
          } else {
            if (doc) {
              res.status(200).json(ApiResponse.returnSucess());
            } else {
              res.status(406).json(ApiResponse.noDataFound())
            }
          }
        });
      } else {
        res.status(406).json(ApiResponse.parameterNotFound('(id)'))
      }
    } catch (e) {
      if (e instanceof Jwt.JsonWebTokenError) {
        res.status(401).json(ApiResponse.unauthorized());
      } else {
        res.status(400).json(ApiResponse.returnError());
      }
    }
  };

  static patch = (req, res) => {
    try {
      TokenGenerator.verify(req.headers.authorization);
      let body = req.body;
      if (Validators.checkField(body.movement)) {
        if (body.movement == 'push') {
          AddOnes.findByIdAndUpdate(body.id, {
            $push: {"items": req.body.item}
          }, (err) => {
            if (err) {
              res.status(500).json(ApiResponse.dbError(err));
            } else {
              res.status(200).json(ApiResponse.returnSucess());
            }
          });
        } else if (body.movement == 'pull') {
          AddOnes.findByIdAndUpdate(body.id, {
            $pull: {"items": req.body.item}
          }, (err) => {
            if (err) {
              res.status(500).json(ApiResponse.dbError(err));
            } else {
              res.status(200).json(ApiResponse.returnSucess());
            }
          })
        } else {
          res.status(406).json(ApiResponse.parameterNotFound('(movement)'))
        }
      }
    } catch (e) {
      if (e instanceof Jwt.JsonWebTokenError) {
        res.status(401).json(ApiResponse.unauthorized());
      } else {
        res.status(400).json(ApiResponse.returnError());
      }
    }
  }
}

export default AddOneController;
