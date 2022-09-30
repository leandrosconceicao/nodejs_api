class ApiResponse {
  constructor({ statusProcess = false, message = "", dados = null }) {
    this.statusProcess = statusProcess;
    this.message = message;
    this.dados = dados;
  }

  static returnSucess(data) {
    return new ApiResponse({
      statusProcess: true,
      dados: data,
      message: "Success",
    });
  }

  static returnError(message) {
    return new ApiResponse({ message: message });
  }

  static dbError(errorMessage) {
    return new ApiResponse({
      message: `Requisição não pode ser processada pelo servidor ${errorMessage}`,
    });
  }

  static unknownError(error) {
    return new ApiResponse({
      message: `Ocorreu um erro desconhecido ${error}`,
    });
  }

  static parameterNotFound(message) {
    return new ApiResponse({
      message: `Parametro obrigatório não foi informado ${message}`,
    });
  }

  static unauthorized(message) {
    return new ApiResponse({ message: message });
  }
}

export default ApiResponse;
