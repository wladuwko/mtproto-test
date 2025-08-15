// Упрощённый MTProto-клиент на JS
class MTProtoClient {
    constructor() {
        this.authKey = null;
        this.socket = new WebSocket("wss://m17hzg-79-139-134-245.ru.tuna.am/ws");
        this.socket.onmessage = (e) => this.handleMessage(e);
    }
    // Генерация auth_key (упрощённо)
    async generateAuthKey() {
        // В реальности здесь Diffie-Hellman с сервером
        const response = await fetch("https://m17hzg-79-139-134-245.ru.tuna.am/api/generate-key");
        this.authKey = await response.arrayBuffer();
    }

    // Отправка сообщения
    async sendMessage(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        
        // Шифрование (AES-IGE имитация)
        const encrypted = await this.encrypt(data);
        
        // Отправка на сервер
        this.socket.send(JSON.stringify({
            type: "message",
            data: Array.from(new Uint8Array(encrypted))
        }));
    }

    // Имитация шифрования (в реальности - AES-IGE)
    async encrypt(data) {
        return await crypto.subtle.encrypt(
            { name: "AES-CBC", iv: new Uint8Array(16) },
            await crypto.subtle.importKey("raw", this.authKey, "AES-CBC", false, ["encrypt"]),
            data
        );
    }

    handleMessage(event) {
        const msg = JSON.parse(event.data);
        document.getElementById("chat").innerHTML += `<p>${msg.text}</p>`;
    }
}

const client = new MTProtoClient();
client.generateAuthKey();

function sendMessage() {
    const text = document.getElementById("message").value;
    client.sendMessage(text);
}
