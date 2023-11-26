import ApiResponse from "../../models/ApiResponse.js";
import https from "https";
import fs from "fs";
import * as dotenv from "dotenv";
import axios from "axios";
import Validators from "../../utils/utils.js";
import InvalidParameter from "../errors/InvalidParameter.js";
import PixPayments from "../../models/PixPayments.js";

dotenv.config();

const certificado = fs.readFileSync(process.env.CERTIFICATE_PATH);


const AGENT = new https.Agent({
  pfx: certificado,
  passphrase: "",
});

const URL = process.env.PAYMENT_API;
const PIX_KEY = process.env.PIX_KEY;

let token_data;

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
      const { value, info, expiration_date, clientData, userCreate,  storeCode} = req.body;
      if (!Validators.checkField(userCreate)) {
        throw new InvalidParameter("userCreate");
      }
      if (!Validators.checkField(storeCode)) {
        throw new InvalidParameter("storeCode");
      }
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
      requisition.data.payment_data = await getQrCode(TOKEN_DATA, requisition.data.loc.id);
      await PixPayments({
        storeCode: storeCode,
        userCreate: userCreate,
        txId: requisition.data.txid,
      }).save();
      return ApiResponse.returnSucess(requisition.data).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  async validatePaymentCharge(req, res, next) {
    try {
        let id  = req.params.txid;
        if (!Validators.checkField(id)) {
          throw new InvalidParameter("id");
        }
      let pix = await PixPayments.findOne({txId: id})
        .populate("storeCode")
        .populate("userCreate", ["-establishments", "-pass"]);
      return ApiResponse.returnSucess(pix).sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  async cancelPixCharge(req, res, next) {
    try {
      const {txId} = req.body;
      if (!Validators.checkField(txId)) {
        throw new InvalidParameter("txId");
      }
      let process = await ChargesController.cancelPixCharge(txId)
      if (!process.modifiedCount) {
        return ApiResponse.badRequest("Nenhum dado modificado, verifique os termos da busca.").sendResponse(res);
      }
      return ApiResponse.returnSucess().sendResponse(res);
    } catch (e) {
      next(e);
    }
  }

  static async cancelPixCharge(txId) {
    return PixPayments.updateOne({
      txId: txId
    }, {
      $set: {
        status: "cancelled"
      }
    });
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

  async webhook(req, res) {
    let {hmac} = req.query;
    if (!Validators.checkField(hmac)) {
      res.sendStatus(403);
      return;
    }
    if (hmac !== process.env.GESTOR_HMAC) {
      res.sendStatus(403);
      return;
    }
    let reqBody = req.body;
    console.log(reqBody);
    let pixReq = reqBody.pix[0];
    await PixPayments.findOneAndUpdate({
      txId: pixReq.txid
    }, {
      $set: {
        status: "finished",
        endToEndId: pixReq.endToEndId,
        updated_at: new Date()
      }
    });
      
    res.sendStatus(200);
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

// function getDefaultReq(token) {
//   return axios.create({
//     baseUrl: URL,
//     httpsAgent: AGENT,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     }
//   });
// }

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
    let now = new Date();
    if (!token_data || now > token_data.expiration_date) {
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
      token_data = req.data;
      let expiration = new Date();
      expiration.setSeconds(3200);
      token_data.expiration_date = expiration;
    }
    return token_data;
  } catch (e) {
    return undefined;
  }
}

export default ChargesController;
