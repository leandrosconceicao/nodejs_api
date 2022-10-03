import Clients from "../models/Clients.js";
import ApiResponse from "../models/ApiResponse.js";

class ClientController {
    static findAll = (req, res) => {
        let client = new Clients(req.query);
        Clients.find(client,(err, client) => {
            if (err) {
                res.status(500).json(ApiResponse.dbError(err));
            } else {
                console.log(client);
                res.status(200).json(ApiResponse.returnSucess(client));
            }
        })
    }

    static add = (req, res) => {
        let product = new Clients(req.body);
        product.save((err) => {
            if (err) {
                res.status(500).send(ApiResponse.returnError())
            } else {
                res.status(201).json(ApiResponse.returnSucess())
            }
        })
        
    }

    static update = (req, res) => {
        let id = req.body.id;
        let data = req.body.data;
        Clients.findByIdAndUpdate(id, {$set: data}, (err) => {
            if (err) {
                res.status(500).send(ApiResponse.dbError(err));
            } else {
                res.status(200).json(ApiResponse.returnSucess())
            }
        })
    }

    static delete = (req, res) => {
        let id = req.body.id;
        Clients.findByIdAndDelete(id, (err) => {
            if (err) {
                res.status(500).json(ApiResponse.dbError(err))
            } else {
                res.status(200).json(ApiResponse.returnSucess())
            }
        })
    }
}

export default ClientController;