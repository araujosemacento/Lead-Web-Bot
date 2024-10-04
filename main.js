// Este arquivo é o ponto de entrada da aplicação.
// Ele importa as dependências necessárias e inicia a conexão com o MongoDB.

// Importa as dependências
const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const qrcode = require('qrcode-terminal');
const winston = require('winston');
const { default: ollama } = require('ollama/browser');
const config = require('./config');
const messageHandlers = require('./messageHandlers');

// Configura o logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Função principal
async function main() {
    // Conecta ao MongoDB
    const store = await connectToMongoDB();
    // Inicializa o cliente WhatsApp
    await initializeWhatsAppClient(store);
}

// Função para conectar ao MongoDB
async function connectToMongoDB() {
    try {
        // Conecta ao MongoDB usando a URI do arquivo .env
        await mongoose.connect(config.mongodbUri);
        logger.info('Conectado ao MongoDB com sucesso');
        // Retorna a instância do MongoDB
        return new MongoStore({ mongoose: mongoose });
    } catch (error) {
        logger.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
}

// Função para inicializar o cliente WhatsApp
async function initializeWhatsAppClient(store) {
    // Cria uma instância do cliente WhatsApp
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: config.backupSyncIntervalMs,
        }),
        puppeteer: config.puppeteerOptions,
    });

    // Adiciona os handlers de mensagem
    client.on('message_create', messageHandlers.handleMessageCreate);

    try {
        // Inicializa o cliente WhatsApp
        await client.initialize();
        logger.info('Cliente inicializado com sucesso');
    } catch (error) {
        logger.error('Erro ao inicializar o cliente:', error);
        process.exit(1);
    }

    exports.client = client;
}

// Chama a função principal
main().catch(error => {
    logger.error('Erro na execução principal:', error);
    process.exit(1);
});