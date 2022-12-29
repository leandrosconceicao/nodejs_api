import Queue from "../../models/Queue.js";
import ApiResponse from "../../models/ApiResponse.js";
import Validators from "../../utils/utils.js";

class QueueService {

    static findAll = (req, res) => {
        let storeCode = req.query.storeCode;
        if (!Validators.checkField(storeCode)) {
            res.status(406).json(ApiResponse.parameterNotFound('(storeCode)'))
        } else {
            Queue.find({storeCode: storeCode}, (err, data) => {
                if (err) {
                    res.status(500).json(ApiResponse.dbError(err));
                } else {
                    res.status(200).json(ApiResponse.returnSucess(data))
                }
            })
        }
    }

    static generate = async (req, res) => {
        const storeCode = req.params.storeCode;
        if (!Validators.checkField(storeCode)) {
            res.status(406).json(ApiResponse.parameterNotFound('(storeCode)'));
        } else {
            const queue = await Queue.find({storeCode: storeCode});
            if (!queue.length) {
                let newQueue = new Queue({
                    date: new Date().toISOString(),
                    position: 1,
                    storeCode: storeCode,
                });
                newQueue.save((err, q) => {
                    if (err) {
                        res.status(500).json(ApiResponse.dbError(err));
                    } else {
                        res.status(201).json(ApiResponse.returnSucess([q]));
                    }
                })
            } else {
                let lastOnLine = queue.slice(-1)[0];
                let newQueue = new Queue({
                    date: new Date().toISOString(),
                    position: lastOnLine.position + 1,
                    storeCode: storeCode,
                })
                newQueue.save((err) => {
                    if (err) {
                        res.status(500).json(ApiResponse.dbError(err));
                    } else {
                        Queue.find({storeCode: storeCode}, (err, data) => {
                            if (err) {
                                res.status(500).json(ApiResponse.dbError(err));
                            } else {
                                res.status(200).json(ApiResponse.returnSucess(data));
                            }
                        }).sort({ position: -1 }).limit(5)
                    }
                })
            }
        }
    }

    static delete = (req, res) => {
        let storeCode = req.params.storeCode;
        if (!Validators.checkField(storeCode)) {
            res.status(406).json(ApiResponse.parameterNotFound('(storeCode)'));
        } else {
            Queue.deleteMany({storeCode: storeCode}, (err) => {
                if (err) {
                    res.status(500).json(ApiResponse.dbError(err));
                } else {
                    res.status(200).json(ApiResponse.returnSucess());
                }
            })
        }
    }
}

export default QueueService;