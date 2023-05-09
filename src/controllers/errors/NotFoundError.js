import ApiResponse from "../../models/ApiResponse.js";

class NotFoundError extends ApiResponse {
  constructor(message = "Página não encontrada") {
    super({
      statusProcess: false,
      message: message,
      dados: null,
      tecnical: null,
      status: 404,
    });
  }
}

export default NotFoundError;
