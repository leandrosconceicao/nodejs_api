import Clients from "../../models/Clients.js";
import ApiResponse from "../../models/ApiResponse.js";
import PassGenerator from "../../utils/passGenerator.js";
import Validators from "../../utils/utils.js";

class ClientController {
  static async authentication(req, res) {
    try {
      const hashpass = new PassGenerator(req.body.password).build();
      const client = await Clients.findOne({
        email: req.body.email,
        password: hashpass,
      });
      if (client) {
        if (client.isValid) {
          res.status(200).json(ApiResponse.returnSucess(client));
        } else {
          res.status(401).json(ApiResponse.returnError('Cadastro não foi validado, verifique sua caixa de email e confirme clicando no link enviado'))
        }
      } else {
        res.status(400).json(ApiResponse.returnError('Usuário inválido ou não encontrado, verifique os dados e tente novamente.'))
      }
    } catch (e) {
      res.status(500).json(ApiResponse.returnError(e))
    }
  }

  static async findOne(req, res) {
    let id = req.params.id;
    if (!Validators.checkField(id)) {
      res.status(406).json(ApiResponse.parameterNotFound('id'))
    } else {
      Clients.findById(req.params.id, (err, client) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(500).json(ApiResponse.returnSucess(client));
        }
      })
    }
  }

  static async findAll(req, res) {
    let query = req.query;
      if (!Validators.checkField(query.name)) {
        delete query.name;
      } else if (!Validators.checkField(query.cgc)) {
        delete query.cgc;
      } else if (!Validators.checkField(query.email)) {
        delete query.email;
      } else if (!Validators.checkField(query.isActive)) {
        delete query.isActive;
      }
      let client = new Clients(query);
      Clients.find(client, (err, cli) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          res.status(200).json(ApiResponse.returnSucess(cli));
        }
      })
  }

  static async add(req, res) {
    let client = new Clients(req.body);
    client.password = new PassGenerator(client.password).build();
    client.save((err) => {
      if (err) {
        if (err.code === 11000) {
          res.status(400).json(ApiResponse.returnError(`Atenção Usuário já cadastrado.`));
        } else {
          res.status(500).json(ApiResponse.dbError(err));
        }
      } else {
        res.status(200).json(ApiResponse.returnSucess());
      }
    })
  }

  static async update(req, res) {
    try {
      let id = req.body.id;
      let data = req.body.data;
      const db = await Clients.findByIdAndUpdate(id, { $set: data });
      if (db) {
        res.status(200).json(ApiResponse.returnSucess(db));
      } else {
        res
          .status(400)
          .json(
            ApiResponse.returnError(
              "Nenhum dado atualizado, verifique os filtros e tente novamente."
            )
          );
      }
    } catch (e) {
      res.status(500).json(ApiResponse.dbError(e));
    }
  }

  static async delete(req, res) {
    try {
      let id = req.body.id;
      const db = await Clients.findByIdAndDelete(id);
      if (db) {
        res.status(200).json(ApiResponse.returnSucess(db));
      } else {
        res
          .status(400)
          .json(
            ApiResponse.returnError(
              "Nenhum dado excluido, verifique os filtros e tente novamente"
            )
          );
      }
    } catch (e) {
      res.status(500).json(ApiResponse.dbError(e));
    }
  }
}

export default ClientController;
