import Jwt from 'jsonwebtoken';
import users from '../models/Users.js';

class TokenGenerator {
    static generate(users) {
        return Jwt.sign({id: users._id}, process.env.CHAVE_JWT);
    }
}

export default TokenGenerator;