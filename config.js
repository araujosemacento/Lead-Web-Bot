// Este arquivo define as configurações da aplicação.
// Ele define as variáveis de ambiente e as opções para o cliente WhatsApp.

// Importa as dependências
require('dotenv').config();

// Define as configurações
module.exports = {
  mongodbUri: process.env.MONGODB_URI,
  backupSyncIntervalMs: 216000,
  puppeteerOptions: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
};