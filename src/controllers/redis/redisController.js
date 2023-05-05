import { createClient } from 'redis';
import ApiResponse from '../../models/ApiResponse.js';
import Validators from '../../utils/utils.js';
class RedisController {

    
    static async findOne(req, res) {
        try {
            let query = req.query
            if (!Validators.checkField(query.key)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(key)'));
            }
            
            const client = createClient();
            await client.connect();

            const procc = await client.get(query.key);
            client.disconnect();
            if (!procc) {
                return res.status(404).json(ApiResponse.noDataFound());
            }
            return res.status(200).json(ApiResponse.returnSucess(procc));
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }

    static async post(req, res) {
        try {
            let body = req.body;
            if (!Validators.checkField(body.key)) {
                return res.status(406).json(ApiResponse.parameterNotFound('key'));
            }
            if (!Validators.checkField(body.value)) {
                return res.status(406).json(ApiResponse.parameterNotFound('(value)'));
            }
            const client = createClient();
            await client.connect();

            const procc = await client.set(body.key, body.value);
            return res.status(200).json(ApiResponse.returnSucess(procc));
            
        } catch (e) {
            return res.status(500).json(ApiResponse.dbError(e));
        }
    }
    
}

export default RedisController;