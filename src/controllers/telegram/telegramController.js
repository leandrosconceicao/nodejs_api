import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const key = process.env.TELEGRAMKEY;
const chatId = process.env.CHAT_ID;

class TelegramApi {

    async notifyUsers(text) {
        try {
            await axios.post(`https://api.telegram.org/bot${key}/sendMessage`, {
                "chat_id": chatId,
                "text": text,
                "parse_mode": "html"
            })
        } catch (e) {
            console.log(`Ocorreu um erro ${e}`)
        }
    }
}

export default TelegramApi;