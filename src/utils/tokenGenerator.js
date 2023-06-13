import Jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
class TokenGenerator {
    static generate(users) {
        return Jwt.sign({id: users._id}, process.env.CHAVE_JWT, {expiresIn: '12h'});
    }

    static verify(token) {
        return Jwt.verify(token, process.env.CHAVE_JWT);
    }

    static getToken() {
        return crypto.randomBytes(20).toString('hex');
    }

    static generateId() {
        return uuidv4();
    }


}

export default TokenGenerator;