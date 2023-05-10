import ApiResponse from "../../models/ApiResponse.js";

class ValidationError extends ApiResponse {
  constructor(erro) {
    const msg = Object.values(erro.errors).map(err => erro.message).join("; ");
    super({
      statusProcess: false,
      message: `Os seguintes erros foram encontrados: ${msg}`,
      dados: null,
      tecnical: null,
      status: 400,
    });
  }
}

export default ValidationError;
