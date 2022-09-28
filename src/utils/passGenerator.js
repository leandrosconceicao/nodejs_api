import crypto from 'crypto';

class PassSecurity {
    constructor(password) {
        this.password = password;
    }

    build() {
        return crypto.scryptSync(this.password, 'salt', 64).toString('hex');
    }
}

export default PassSecurity;