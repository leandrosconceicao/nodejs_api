import establishments from "../../models/Establishments.js";
import ApiResponse from "../../models/ApiResponse.js";
import Validators from "../../utils/utils.js";

class EstablishmentsController {
  static findAll = (req, res) => {
    let query = new establishments(req.query);
    establishments.find(query, { ownerId: 0 }, (err, est) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess(est));
      }
    });
  };

  static findOne = (req, res) => {
    const param = req.params;
    establishments.findById(
      { _id: param.id },
      { ownerId: 0 },
      (err, establishments) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(200).json(ApiResponse.returnSucess(establishments));
        }
      }
    );
  };

  static add = (req, res) => {
    let est = new establishments(req.body);
    est.save((err, ests) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(201).json(ApiResponse.returnSucess(ests));
      }
    });
  };

  static del = (req, res) => {
    if (!Validators.checkField(req.body.id)) {
      res.status(406).json(ApiResponse.parameterNotFound('id'))
    } else {
      establishments.findByIdAndDelete(req.body.id, (err) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(200).json(ApiResponse.returnSucess());
        }
      })
    }
  };

  static patch = (req, res) => {
    if (!Validators.checkField(req.body.id)) {
      res.status(406).json(ApiResponse.parameterNotFound('id'));
    } else if (!Validators.checkField(req.body.data)) {
      res.status(406).json(ApiResponse.parameterNotFound('data'))
    } else if (!Validators.checkField(req.body.movement)) {
      res.status(406).json(ApiResponse.parameterNotFound('movement'));
    } else {
      if (req.body.movement == 'push') {
        establishments.findByIdAndUpdate(req.body.id, {
          $push: {"stores": req.body.data},
        }, (err) => {
          if (err) {
            res.status(500).json(ApiResponse.dbError(err));
          } else {
            res.status(201).json(ApiResponse.returnSucess())
          }
        })
      } else if (req.body.movement == 'pull') {
        establishments.findByIdAndUpdate(req.body.id, {
          $pull: {"stores": req.body.data},
        }, (err) => {
          if (err) {
            res.status(500).json(ApiResponse.dbError(err));
          } else {
            res.status(201).json(ApiResponse.returnSucess())
          }
        })
      } else {
        res.status(406).json(ApiResponse.parameterNotFound('movement'));
      }
    }
  }
}

export default EstablishmentsController;
