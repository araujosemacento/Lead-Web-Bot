const { Client, RemoteAuth } = require('whatsapp-web.js');
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const qrcode = require('qrcode-terminal');
const winston = require('winston');

// Configuração do logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// Configurações
const config = {
    mongodbUri: "mongodb+srv://araujosemacento:3,QuatorzeQuinze@wabotdatabank.ejoy6.mongodb.net/?retryWrites=true&w=majority&appName=WABotDatabank",
    backupSyncIntervalMs: 216000,
    puppeteerOptions: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
};

// Função para conectar ao MongoDB
async function connectToMongoDB() {
    try {
        await mongoose.connect(config.mongodbUri);
        logger.info('Conectado ao MongoDB com sucesso');
        return new MongoStore({ mongoose: mongoose });
    } catch (error) {
        logger.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1);
    }
}

// Função para inicializar o cliente WhatsApp
async function initializeWhatsAppClient(store) {
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: config.backupSyncIntervalMs
        }),
        puppeteer: config.puppeteerOptions,
    });

    client.on('ready', () => logger.info('Cliente está pronto!'));
    client.on('qr', qr => qrcode.generate(qr, { small: true }));

    attachMessageHandlers(client);

    try {
        await client.initialize();
        logger.info('Cliente inicializado com sucesso');
    } catch (error) {
        logger.error('Erro ao inicializar o cliente:', error);
        process.exit(1);
    }
}

// Função para anexar manipuladores de mensagens
function attachMessageHandlers(client) {
    client.on('message_create', handleMessageCreate);
    client.on('message_edit', () => logger.info('Mensagem editada'));
    client.on('message_update', () => logger.info('Mensagem atualizada'));
    client.on('message_reaction_add', () => logger.info('Reação adicionada à mensagem'));
    client.on('message_delete', () => logger.info('Mensagem excluída'));
    client.on('message_ack', () => logger.info('Mensagem reconhecida'));
    client.on('message_revoke', () => logger.info('Mensagem revogada'));
    client.on('message_send', () => logger.info('Mensagem enviada'));
    client.on('message_send_error', (message, error) => logger.error('Erro ao enviar mensagem:', error));
}

// Manipulador de mensagens criadas
function handleMessageCreate(message) {
    logger.info(`Mensagem recebida: ${message.body}`);
    if (message.body === 'menu') {
        message.reply(`
      1- uau
      2- uauauau
      `);
    }
}

// Função principal
async function main() {
    const store = await connectToMongoDB();
    await initializeWhatsAppClient(store);
}

main().catch(error => {
    logger.error('Erro na execução principal:', error);
    process.exit(1);
});