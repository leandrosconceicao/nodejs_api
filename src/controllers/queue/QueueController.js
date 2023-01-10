import ApiResponse from '../../models/ApiResponse.js';
import Queue from '../../models/Queue.js';
import Validators from '../../utils/utils.js';
class QueueService {

    static findAll = (req, res) => {
        let storeCode = req.query.storeCode;
        if (!Validators.checkField(storeCode)) {
            res.status(400).json(ApiResponse.parameterNotFound('(branch)'));
        } else {
            Queue.find({storeCode: storeCode}, (err, queue) => {
                if (err) {
                    res.status(500).json(ApiResponse.dbError(err));
                } else {
                    res.status(200).json(ApiResponse.returnSucess(queue));
                }
            })
        }
    }

    static add = (req, res) => {
        let storeCode = req.body.storeCode;
        if (!Validators.checkField(storeCode)) {
            res.status(400).json(ApiResponse.parameterNotFound('(storeCode)'));
        } else {
            Queue.find({storeCode: storeCode}, (err, queue) => {
                if (err) {
                    res.status(500).json(ApiResponse.dbError(err));
                } else {
                    const newQueue = new Queue({
                        position: queue.position++,
                        date: new Date().toLocaleDateString(),
                        storeCode: storeCode,
                    });
                    newQueue.save((err, q) => {
                        if (err) {
                            res.status(500).json(ApiResponse.dbError(err));
                        } else {
                            res.status(201).json(ApiResponse.returnSucess(q));
                        }
                    })
                }
            })
        }
    }
}

export default QueueService;