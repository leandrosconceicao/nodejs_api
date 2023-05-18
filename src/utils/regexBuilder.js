class RegexBuilder {
    static searchByName(text) {
        return new RegExp(text, "i");
    }
}

export default RegexBuilder;