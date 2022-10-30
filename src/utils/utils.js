class Validators {
    static checkField(field) {
        if (field != undefined) {
            return true;
        } else {
            return false;
        }
    }
}

export default Validators;