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

let interval;

class ChargesController {

  async findCharges(req, res, next) {
    try {
      // cob?inicio=2020-10-22T16:01:35Z&fim=2020-11-30T20:10:00Z
      const TOKEN_DATA = await getOAuth();
      if (!TOKEN_DATA) {
        return noTokenReturn(res);
      }
      const {start, end} = req.query;
      if (!Validators.checkField(start) && !Validators.checkField(end)) {
        throw new InvalidParameter("start, end");
      }
      let startDate = new Date(start);
      let endDate = new Date(end);
      if (isNaN(startDate.getTime())) {
        throw new InvalidParameter("start");
      }
      if (isNaN(endDate.getTime())) {
        throw new InvalidParameter("end");
      }
      const request = await axios({
        method: "GET",
        url: `${URL}/v2/cob?inicio=${start}&fim=${end}`,
        headers: setHeaders(TOKEN_DATA),
        httpsAgent: AGENT,
      });
      return ApiResponse.returnSucess(request.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  async createCharge(req, res, next) {
    try {
      const TOKEN_DATA = await getOAuth();
      if (!TOKEN_DATA) {
        return noTokenReturn(res);
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

  async validatePaymentCharge(req, res, next) {
    try {
      interval = undefined;
      const TOKEN_DATA = await getOAuth();
      if (!TOKEN_DATA) {
        return noTokenReturn(res);
      }
      let id  = req.params.txid;
      if (!Validators.checkField(id)) {
        throw new InvalidParameter("id");
      }
      res.set("Content-Type", "text/event-stream");
      res.set("Connection", "keep-alive");
      res.set("Cache-Control", "no-cache");
      res.set("Access-Control-Allow-Origin", "*");
        // const requisition = await onGetPixStatus(id, TOKEN_DATA);
        // if (requisition.data.status === "CONCLUIDA") {
        //   res.status(200).send(`${JSON.stringify(ApiResponse.returnSucess(requisition.data))}`)
        //   return;
        // }
      interval = setInterval(async () => {
        const requisition = await onGetPixStatus(id, TOKEN_DATA);
        console.log(requisition.data);
        if (requisition.data.status !== "ATIVA") {
          clearInterval(interval);
          res.status(200).write(`${JSON.stringify(ApiResponse.returnSucess(requisition.data))}`)
          return;
        }
        res.status(200).write(`${JSON.stringify(ApiResponse.returnSucess(requisition.data))}`)
      }, 30000);
    } catch (e) {
      next(e);
    }
  }

  async refundPixCharge(req, res, next) {
    try { 
      const TOKEN_DATA = await getOAuth();
      if (!TOKEN_DATA) {
        return noTokenReturn(res);
      }
      const {e2eId, id, value} = req.body;
      if (!Validators.checkField(e2eId)) {
        throw new InvalidParameter("e2eId");
      }
      if (!Validators.checkField(id)) {
        throw new InvalidParameter("id");
      }
      if (!Validators.checkField(value)) {
        throw new InvalidParameter("value");
      }
      const request = axios({
        method: "PUT",
        url: `${URL}/v2/pix/${e2eId}/devolucao/${id}`,
        headers: setHeaders(TOKEN_DATA),
        httpsAgent: AGENT
      });
      return ApiResponse.returnSucess(request.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }
}

async function onGetPixStatus(id, TOKEN_DATA) {
  let date = new Date();
  console.log(date.toLocaleDateString());
  return await axios({
    method: "GET",
    url: `${URL}/v2/cob/${id}`,
    headers: setHeaders(TOKEN_DATA),
    httpsAgent: AGENT,
  });
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

function noTokenReturn(res) {
  return ApiResponse.badRequest("Não foi possível recuperar o token ").sendResponse(res);
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

export default ChargesController;
