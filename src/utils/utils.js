import {isValidObjectId} from "mongoose";

class Validators {
    static checkField(field) {
        if (field) {
            return true;
        } else {
            return false;
        }
    }

    static checkType(value, type) {
        const tp = typeof value;
        return tp === type;
    }

    static isObjectId(value) {
        return isValidObjectId(value);
    }
}

export default Validators;