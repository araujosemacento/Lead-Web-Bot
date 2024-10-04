// Este arquivo configura o logger da aplicação.
// Ele define o formato e os transportes para o logger.

// Importa as dependências
const winston = require('winston');

// Configura o logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.timestamp({
    format: 'DD/MM/YYYY HH:mm:ss'
  }),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Exporta o logger
module.exports = logger;