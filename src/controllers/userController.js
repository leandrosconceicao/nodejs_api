import users from "../models/Users.js";
import ApiResponse from "../models/api_response.js";
import crypto from 'crypto';

class UserController {
    static add = (req, res) => {
        let user = new users(req.body);
        user.save((err, users) => {
            if (err) {
                res.status(500).json(ApiResponse.dbError(err))
            } else {
                res.status(200).json(ApiResponse.returnSucess(users));
            }
        })
    }

    static findAll = (req, res)  => {
        console.log(req.query);
        if (req.query.storeCode) {
            users.find(req.query, (err, users) => {
                if (err) {
                    res.status(500).json(ApiResponse.dbError(err))
                } else {
                    res.status(200).json(ApiResponse.returnSucess(users))
                }
            })
        } else {
            res.status(400).json(ApiResponse.returnError('Parametro obrigátorio não foi informado'))
        }
    }
    
    static authenticate = (req, res) => {
        try {
            const hashPass = crypto.createHash('md5').update(req.body.pass).digest('hex')
            users.findOne({_id: req.body.email, pass: hashPass}, (err, users) => {
                if (err) {
                    res.status(500).json(ApiResponse.returnError(`Ocorreu um problema ${err}`));
                } else {
                    if (users) {
                        res.status(200).json(ApiResponse.returnSucess(users));
                    } else {
                        res.status(400).json(ApiResponse.returnError('Dados incorretos ou inválidos.'))
                    }
                }
            });
        } catch (e) {
            res.status(500).json(ApiResponse.unknownError(e))
        }
    }
}

export default UserController;