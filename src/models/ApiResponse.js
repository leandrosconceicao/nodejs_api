class ApiResponse {
  constructor({
    statusProcess = false,
    message = "",
    dados = null,
    tecnical = null,
    status = 500,
  }) {
    this.statusProcess = statusProcess;
    this.message = message;
    this.dados = dados;
    this.tecnical = tecnical;
    this.status = status;
  }

  static returnSucess(data) {
    return new ApiResponse({
      statusProcess: true,
      dados: data,
      message: "Success",
      status: 200,
    });
  }

  static returnError(message) {
    return new ApiResponse({ message: message });
  }

  static dbError(errorMessage) {
    return new ApiResponse({
      message: "O servidor não conseguiu processar a requisição",
      tecnical: errorMessage.stack,
      status: 500,
    });
  }

  static badRequest(message) {
    return new ApiResponse({
      message: "Houve um problema com a requisição",
      tecnical: message,
    });
  }

  static unknownError(error) {
    return new ApiResponse({
      message: `Ocorreu um erro desconhecido ${error}`,
    });
  }

  static parameterNotFound(message) {
    return new ApiResponse({
      message: `Parametro obrigatório é inválido ou não foi informado ${message}`,
    });
  }

  static unauthorized() {
    return new ApiResponse({ message: "Token inválido ou não informado" });
  }

  static tokenExpired() {
    return new ApiResponse({ message: "Token expirado" });
  }

  static noDataFound() {
    return new ApiResponse({ message: "Nenhum dado encontrado" });
  }

  sendResponse(res, status) {
    res.status(status).json(this)
  }
}

export default ApiResponse;
