import ApiResponse from "../../models/ApiResponse.js";

class InvalidParameter extends ApiResponse {
  constructor(parameter) {
    super({
      statusProcess: false,
      message: `Parametro obrigatório é inválido ou não foi informado (${parameter})`,
      dados: null,
      tecnical: null,
      status: 406,
    });
  }
}

export default InvalidParameter;
