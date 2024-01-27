import ApiResponse from "../../models/ApiResponse.js";

export default class MercadoPagoError extends ApiResponse {
    constructor(error) {
        let message;
        if (error.response.data.error === "2205") {
            message = "Já existe uma solicitação de pagamento pendente no dispositivo, necessário aguardar a finalização para realizar uma nova solicitação."
        } else if (error.response.data.error === "101") {
            message = "ID de pagamento não foi localizado."
        } else if (error.response.data.error === "105") {
            message = "Limite de requisições atingido, aguarde alguns instantes para realizar uma nova requisição"
        } else {
            message = `${error.response.data.message}`;
        }
        super({
            statusProcess: false,
            message: message,
            dados: null,
            tecnical: error.response.data,
            status: error.response.data.status
        });
    }
}