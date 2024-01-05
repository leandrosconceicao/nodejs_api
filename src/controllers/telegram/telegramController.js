import * as dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const key = process.env.TELEGRAMKEY;
// const chatId = process.env.CHAT_ID;

const botUrl = `https://api.telegram.org/bot${key}`;

class TelegramApi {

    async notifyUsers(text, chatId) {
        try {
            await axios.post(`${botUrl}/sendMessage`, {
                "chat_id": chatId,
                "text": text,
                "parse_mode": "html"
            })
        } catch (e) {
            console.log(`Ocorreu um erro ${e.data}`)
        }
    }
}

export default TelegramApi;