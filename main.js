const { Client, RemoteAuth } = require('whatsapp-web.js');

const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');
const qrcode = require('qrcode-terminal');

mongoose.connect(process.env.MONGODB_URI).then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 216000
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
    });

    client.on('ready', () => {
        console.log('Client is ready!');
    });

    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    client.on('message_create', message => {
        console.log(message.body);
        if (message.body === 'menu') {
            message.reply(`
            1- uau
            2- uauauau
            `);
        }
    });

    client.on('message_edit', message => {
        console.log('Message edited');
    });

    client.on('message_update', message => {
        console.log('Message updated');
    });
    client.on('message_reaction_add', message => {
        console.log('Message reacted');
    });

    client.on('message_delete', message => {
        console.log('Message deleted');
    });

    client.on('message_ack', message => {
        console.log('Message acknowledged');
    });

    client.on('message_revoke', message => {
        console.log('Message revoked');
    });

    client.on('message_send', message => {
        console.log('Message sent');
    });

    client.on('message_send_error', (message, error) => {
        console.log(error);
    });

    client.initialize();
});