
class ApiResponse {
  constructor({ statusProcess = false, message = "", dados = null , tecnicalDescription = null}) {
    this.statusProcess = statusProcess;
    this.message = message;
    this.dados = dados;
    this.tecnicalDescription = tecnicalDescription;
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

  static dbError(errorMessage, stackTrace) {
    return new ApiResponse({
      message: `Requisição não pode ser processada pelo servidor ${errorMessage}`,
      tecnicalDescription: stackTrace
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
    return new ApiResponse({ message: 'Token inválido ou não informado'});
  }

  static tokenExpired() {
    return new ApiResponse({message: 'Token expirado'});
  }

  static noDataFound() {
    return new ApiResponse({message: 'Nenhum dado encontrado'})
  }
}

export default ApiResponse;
