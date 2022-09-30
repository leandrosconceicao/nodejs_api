import Jwt from 'jsonwebtoken';

class TokenGenerator {
    static generate(users) {
        return Jwt.sign({id: users._id}, process.env.CHAVE_JWT);
    }

    static verify(token) {
        return Jwt.verify(token, process.env.CHAVE_JWT);
    }
}

export default TokenGenerator;