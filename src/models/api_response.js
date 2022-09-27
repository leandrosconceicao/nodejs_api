class ApiResponse {


    static returnSucess(data) {
        return {
            statusProcess: true,
            message: 'Success',
            dados: data,
        }
    }

    static returnError(message) {
        return {
            statusProcess: false,
            message: message,
            dados: null,
        }
    }

    static dbError(errorMessage) {
        return {
            statusProcess: false,
            message: `Ocorreu um problema ${errorMessage}`,
            dados: null,
        }
    }

    static unknownError(error) {
        return {
            statusProcess: false,
            message: `Ocorreu um erro desconhecido ${error}`,
            dados: null,
        }
    }

    static parameterNotFound(message) {
        return {
            statusProcess: false,
            message: `Parametro obrigatório não foi informado ${message}`,
            dados: null,
        }
    }
}

export default ApiResponse;