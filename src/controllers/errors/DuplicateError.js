import ApiResponse from "../../models/ApiResponse.js";

class DuplicateError extends ApiResponse {
  constructor(error) {
    super({
      statusProcess: false,
      message: "Não foi possível salvar, dado duplicado foi detectado.",
      dados: null,
      tecnical: error.keyValue,
      status: 400,
    });
  }
}

export default DuplicateError;
