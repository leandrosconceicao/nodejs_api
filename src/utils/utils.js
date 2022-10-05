class Validators {
    static checkField(field) {
        if (field != undefined) {
            return field.trimRight().length > 0;
        } else {
            return false;
        }
    }
}

export default Validators;