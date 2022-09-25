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
}

export default ApiResponse;