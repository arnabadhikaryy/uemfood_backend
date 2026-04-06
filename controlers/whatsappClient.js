import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

const whatsappClient = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true // Runs in the background
    }
});

whatsappClient.on('qr', (qr) => {
    console.log('Scan this QR code to authenticate WhatsApp:');
    qrcode.generate(qr, { small: true });
});

whatsappClient.on('ready', () => {
    console.log('WhatsApp Client is ready to send messages!');
});

export default whatsappClient;