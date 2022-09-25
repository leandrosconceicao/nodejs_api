import users from "../models/Users.js";
import ApiResponse from "../models/api_response.js";
import crypto from 'crypto';

class UserController {
    static add = (req, res) => {
        let user = new users();
        user.save((err, users) => {
            if (err) {
                res.status(500).json(ApiResponse.dbError(err))
            } else {
                res.status(200).json(ApiResponse.returnSucess(users));
            }
        })
    }

    static findAll = (req, res) => {
        users.find(req.query, (err, users) => {
            if (err) {
                res.status(500).json(ApiResponse.dbError(err))
            } else {
                res.status(200).json(ApiResponse.returnSucess(users))
            }
        })
    }
    
    static authenticate = (req, res) => {
        const hashPass = crypto.createHash('md5').update(req.body.pass).digest('hex')
        users.findOne({_id: req.body.email, pass: hashPass}, (err, users) => {
            if (err) {
                res.status(500).json(ApiResponse.returnError(`Ocorreu um problema ${err}`));
            } else {
                if (users) {
                    res.status(200).json(ApiResponse.returnSucess(users));
                } else {
                    res.status(403).json(ApiResponse.returnError('Dados incorretos ou inválidos.'))
                }
            }
        });
    }
}

export default UserController;