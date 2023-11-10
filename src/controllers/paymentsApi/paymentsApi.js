import ApiResponse from "../../models/ApiResponse.js";
import https from "https";
import fs from "fs";
import * as dotenv from "dotenv";
import axios from "axios";
import Validators from "../../utils/utils.js";
import InvalidParameter from "../errors/InvalidParameter.js";

dotenv.config();

const certificado = fs.readFileSync(process.env.CERTIFICATE_PATH);


const AGENT = new https.Agent({
  pfx: certificado,
  passphrase: "",
});

const URL = process.env.PAYMENT_API;
const PIX_KEY = process.env.PIX_KEY;

class PaymentsApi {
  async createCharge(req, res, next) {
    try {
      const TOKEN_DATA = await getOAuth();
      if (!TOKEN_DATA) {
        return ApiResponse.badRequest("Não foi possível recuperar o token ").sendResponse(res);
      }
      const { value, info, expiration_date, clientData } = req.body;
      if (!Validators.checkField(value)) {
        throw new InvalidParameter("value");
      }
      const paymentData = {
        calendario: {
          expiracao: expiration_date ?? 3600,
        },
        valor: {
          original: `${value}`,
        },
        chave: PIX_KEY,
        solicitacaoPagador: info ?? "Cobrança dos serviços prestados.",
      };
      if (Validators.checkField(clientData)) {
        if (
          Validators.checkField(clientData.cgc) &&
          Validators.checkField(clientData.name)
        ) {
          paymentData["devedor"] = {
            cpf: clientData.cgc,
            nome: clientData.name,
          };
        }
      }
      const requisition = await axios({
        method: "POST",
        url: `${URL}/v2/cob`,
        headers: setHeaders(TOKEN_DATA),
        data: JSON.stringify(paymentData),
        httpsAgent: AGENT,
      });
      requisition.data.payment_data = await getQrCode(TOKEN_DATA, requisition.data.loc.id)
      return ApiResponse.returnSucess(requisition.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  async getCharge(req, res, next) {
    try {
      const TOKEN_DATA = await getOAuth();
      if (!TOKEN_DATA) {
        return ApiResponse.badRequest("Não foi possível recuperar o token ").sendResponse(res);
      }
      let id  = req.query.id;
      if (!Validators.checkField(id)) {
        throw new InvalidParameter("id");
      }
      const requisition = await axios({
        method: "GET",
        url: `${URL}/v2/cob/${id}`,
        headers: setHeaders(TOKEN_DATA),
        httpsAgent: AGENT,
      });
      return ApiResponse.returnSucess(requisition.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }
}

async function getQrCode(token, id) {
  try {
    const REQUEST = await axios({
      method: "GET",
      url: `${URL}/v2/loc/${id}/qrcode`,
      headers: setHeaders(token),
      httpsAgent: AGENT,
    });
    return REQUEST.data;
  } catch (e) {
    return undefined;
  }
}

function setHeaders(TOKEN_DATA) {
  return {
    Authorization: "Bearer " + TOKEN_DATA.access_token,
    "Content-Type": "application/json",
  }
}

async function getOAuth() {
  try {

    var data_credentials = process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET;

    // Codificando as credenciais em base64
    var auth = Buffer.from(data_credentials).toString("base64");

    var data = JSON.stringify({
      grant_type: "client_credentials",
    });
    
    const req = await axios({
      method: "POST",
      url: `${URL}/oauth/token`,
      headers: {
        Authorization: "Basic " + auth,
        "Content-Type": "application/json",
      },
      data: data,
      httpsAgent: AGENT,
    });
    return req.data;
  } catch (e) {
    return undefined;
  }
}

export default PaymentsApi;
