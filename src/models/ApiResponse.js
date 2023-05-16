class ApiResponse extends Error {
  constructor({
    statusProcess = false,
    message = "",
    dados = null,
    tecnical = null,
    status = 500,
  }) {
    super();
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
      status: 400,
    });
  }

  static parameterNotFound(message) {
    return new ApiResponse({
      message: `Parametro obrigatório é inválido ou não foi informado (${message})`,
      status: 406,
    });
  }

  static unauthorized() {
    return new ApiResponse({
      message: "Token inválido ou não informado",
      status: 401,
    });
  }

  static tokenExpired() {
    return new ApiResponse({ message: "Token expirado", status: 401 });
  }

  static noDataFound() {
    return new ApiResponse({ message: "Nenhum dado encontrado" });
  }

  static pageNotFound() {
    return new ApiResponse({ message: "Página não encontrada", status: 404 });
  }

  sendResponse(res) {
    res.status(this.status).json(this);
  }
}

export default ApiResponse;
