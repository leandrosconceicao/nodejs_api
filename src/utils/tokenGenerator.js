import Jwt from 'jsonwebtoken';
import crypto from 'crypto';
class TokenGenerator {
    static generate(users) {
        return Jwt.sign({id: users._id}, process.env.CHAVE_JWT, {expiresIn: 86400});
    }

    static verify(token) {
        return Jwt.verify(token, process.env.CHAVE_JWT);
    }

    static getToken() {
        return crypto.randomBytes(20).toString('hex');
    }


}

export default TokenGenerator;