import Clients from "../../models/Clients.js";
import ApiResponse from "../../models/ApiResponse.js";
import PassGenerator from "../../utils/passGenerator.js";
import Validators from "../../utils/utils.js";
import Mail from "../email/clientActivation.js";
import clientActivationTemplate from "../email/templates/activateTemplate.js";
import TokenGenerator from "../../utils/tokenGenerator.js";
import passwordRecoverTemplate from "../email/templates/passwordRecoverTemplate.js";

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
          const token = TokenGenerator.generate(req.body.email);
          res.set("Authorization", token);
          res.set("Access-Control-Expose-Headers", "*");
          res.status(200).json(ApiResponse.returnSucess(client));
        } else {
          res
            .status(401)
            .json(
              ApiResponse.returnError(
                "Cadastro não foi validado, verifique sua caixa de email e confirme clicando no link enviado"
              )
            );
        }
      } else {
        res
          .status(400)
          .json(
            ApiResponse.returnError(
              "Usuário inválido ou não encontrado, verifique os dados e tente novamente."
            )
          );
      }
    } catch (e) {
      res.status(500).json(ApiResponse.returnError(e));
    }
  }

  static async findOne(req, res) {
    let id = req.params.id;
    if (!Validators.checkField(id)) {
      res.status(406).json(ApiResponse.parameterNotFound("id"));
    } else {
      Clients.findById(req.params.id, (err, client) => {
        if (err) {
          res.status(500).json(ApiResponse.dbError(err));
        } else {
          if (!err) {
            res.status(200).json(ApiResponse());
          }
          res.status(200).json(ApiResponse.returnSucess(client));
        }
      });
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
    });
  }

  static async add(req, res) {
    let client = new Clients(req.body);
    client.password = new PassGenerator(client.password).build();
    client.save((err) => {
      if (err) {
        if (err.code === 11000) {
          res
            .status(400)
            .json(ApiResponse.returnError(`Atenção Usuário já cadastrado.`));
        } else {
          res.status(500).json(ApiResponse.dbError(err));
        }
      } else {
        try {
          Mail.send({
            to: client.email,
            subject: "Confirmação de email",
            body: clientActivationTemplate({
              id: client.id,
              name: client.name,
            }),
          });
        } catch (e) {
        } finally {
          res.status(200).json(ApiResponse.returnSucess());
        }
      }
    });
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

  static validate = (req, res) => {
    let id = req.params.id;
    Clients.findByIdAndUpdate(id, { $set: { isValid: true } }, (err) => {
      if (err) {
        res.status(500).json(ApiResponse.dbError(err));
      } else {
        res.status(200).json(ApiResponse.returnSucess());
      }
    });
  };

  static updatePassword = (req, res) => {
    let id = req.body.id;
    let pass = req.body.password;
    let newPass = req.body.newPassword;
    if (!Validators.checkField(id)) {
      res.status(406).json(ApiResponse.parameterNotFound("(id)"));
    } else if (!Validators.checkField(pass)) {
      res.status(406).json(ApiResponse.parameterNotFound("(password)"));
    } else if (!Validators.checkField(newPass)) {
      res.status(406).json(ApiResponse.parameterNotFound("(newPass)"));
    } else {
      let hashPass = new PassGenerator(pass).build();
      let newHashPass = new PassGenerator(newPass).build();
      Clients.findOneAndUpdate(
        { _id: id, password: hashPass },
        { $set: { password: newHashPass } },
        (err, dt) => {
          if (err) {
            res.status(500).json(ApiResponse.dbError(err));
          } else {
            if (!dt) {
              res.status(400).json(ApiResponse.noDataFound());
            } else {
              res.status(200).json(ApiResponse.returnSucess());
            }
          }
        }
      );
    }
  };

  static async recoverPassword(req, res) {
    try {
      const token = req.body.token;
      const pass = req.body.password;
      if (!Validators.checkField(token)) {
        return res.status(406).json(ApiResponse.parameterNotFound('(token)'))
      } else if (!Validators.checkField(pass)) {
        return res.status(406).json(ApiResponse.parameterNotFound('(password)'))
      } else {
        const hashPass = new PassGenerator(pass).build();
        const client = await Clients.findOne({passwordResetToken: token});
        if (!client) {
          return res.status(400).json(ApiResponse.returnError({message: 'Cliente não localizado, ou token inválido, solicite a recuperação de senha novamente.'}));
        } else {
          const now = new Date();
          if (now > client.passwordResetExpires) {
            return res.status(400).json(ApiResponse.returnError({message: 'Token expirado, solicite a recuperação de senha novamente.'}))
          } else {
            Clients.findOneAndUpdate({passwordResetToken: token}, {"$set": {
              password: hashPass
            }, "$unset": {passwordResetExpires: "", passwordResetToken: ""}}, (err) => {
              if (err) {
                return res.status(500).json(ApiResponse.dbError(err));
              } else {
                return res.status(200).json(ApiResponse.returnSucess());
              }
            });
          }
        }
      }
    } catch (e) {
      return res.status(500).json(ApiResponse.dbError(e))
    }
  }

  static async forgotPassword(req, res) {
    try {
      const {email} = req.body;
      if (!Validators.checkField(email)) {
        return res.status(406).json(ApiResponse.parameterNotFound("(email)"));
      } else {
        const cli = await Clients.findOne({ email: email });
        if (!cli) {
          return res.status(400).json(ApiResponse.returnError({message: "Email não localizado, verifique se o email esta correto e tente novamente."}));
        } else {
          
          const token = TokenGenerator.getToken();

          const now = new Date();

          now.setHours(now.getHours() + 1);

          await Clients.findByIdAndUpdate(cli.id, {
            "$set": {
              passwordResetToken: token,
              passwordResetExpires: now,
            }
          });
          const email = new Mail();
          email.transporter().sendMail(Mail.mailer({
            to: cli.email,
            subject: 'Recuperação de senha',
            body: passwordRecoverTemplate({token: token}),
          }), (err) => {
            if (err) {
              return res.status(400).json(ApiResponse.unknownError({error: err}))
            } else {
              return res.status(200).json(ApiResponse.returnSucess());
            }
          })

        }
      }
    } catch (e) {
      return res.status(500).json(ApiResponse.returnError({message: e}));
    }
  };
}

export default ClientController;
