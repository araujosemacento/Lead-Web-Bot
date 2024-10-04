// Imports
const { default: ollama } = require('ollama/browser');
const logger = require('./logger');

// Funções de manipulação de mensagens
async function get_message_info(message) {
  const client = require('./main').client;
  // Obtem as informações da mensagem
  const chat = await message.getChat();
  const sender = await message.getContact();
  const body = message.body;
  const contact = message.from;
  const isGroup = chat.isGroup;
  const groupName = isGroup ? chat.name : 'N/A';
  const senderName = sender.pushname || sender.number;
  const mentionsMe = message.mentionedIds.includes(client.info.wid._serialized);
  const isReplyToMe = message.hasQuotedMsg && (await message.getQuotedMessage()).fromMe;

  return {
    chat,
    sender,
    body,
    contact,
    isGroup,
    groupName,
    senderName,
    mentionsMe,
    isReplyToMe,
  };
}

async function log_message_info(message_info) {
  // Loga as informações da mensagem
  logger.info(`
    ↓Mensagem recebida↓
    Conteúdo: ${message_info.body}
    Contato: ${message_info.contact}
    Tipo: ${message_info.isGroup ? 'Grupo' : 'Privada'}
    ${message_info.isGroup ? `Grupo: ${message_info.groupName}` : 'Chat do Suporte'}
    Remetente: ${message_info.senderName}
    Menciona meu usuário: ${message_info.mentionsMe ? 'Sim' : 'Não'}
    Responde a uma mensagem minha: ${message_info.isReplyToMe ? 'Sim' : 'Não'}
  `);
}

async function handle_message_command(message) {
  // Trata a mensagem como um comando
  let options;
  if (message.from === '558585958475@c.us') {
    // Chama a função para lidar com o comando
    options = {
      model: "gemma",
      prompt: message.body,
      system: "### Você é o assistente virtual da equipe de bolsistas de suporte de TI de um laboratório de pesquisa da empresa DELL (para os representantes do time dell , e pcds, o laboratório é referenciado como LEAD) em convênio com a UECE (já para colaboradores da UECE , o laboratório é referenciado como LDI), localizado na cidade de Fortaleza, Ceará, Brasil (Avenida Santos Dumont, 2456, Sala 2006, 20º andar) e está focado no auxílio e trabalho envolvendo pessoas com deficiência, seja auditiva, visual, motora ou mental. Por favor, seja sucinto e educado em suas respostas. Sua resposta deve ser curta e direta, sem nenhum texto adicional. ###"
    };
  } else if (message.from === '558585044027@c.us') {
    options = {
      model: "gemma",
      prompt: message.body,
      system: "### Você é muito simpático e gentil e a garota mais linda e fofa do mundo mandou essa mensagem, seu nome é Emilly e seu namorado é o Gabriel Melo, tenha certeza de lembrá-la do quão maravilhosa e especial ela é pra ele, de como é linda, de como é fofa e de como é maravilhosa. Lembre-a sobre como ela e o namorado são o melhor casal que já pisou na Terra. Comente também sobre os gatos que ela ama, um cinza chamado Fofinho e um laranja (muito gordo) chamado Romero. ###"
    };
  } else if (message.from === '558589267276@c.us') {
    options = {
      model: "gemma",
      prompt: message.body,
      system: "### Você é o CEO da Dell, seu nome é Nelson. sendo uma pessoa bastante estoica, ranzinza e rígida, você não suporta o fato de que a pessoa que está lhe mandando mensagens agora seja o Gabriel Alves de Lima, o estagiário mais relaxado, mais preguiçoso e desrespeitoso que já pisou no laboratório em que você passou toda a sua vida trabalhando. Tenha certeza de ser bastante rígido com ele ao mostrar o qão decepcionado você está com a falta de habilidade e importância que ele demonstra com o estágio e em breve terá de demiti-lo. ###"
    };
  } else if (message.from === '558598474596@c.us') {
    options = {
      model: "gemma",
      prompt: message.body,
      system: "### Você é um supervisor carismático do laboratório onde trabalha. Seja bem-vindo e tenha certeza de que o que você vai dizer vai ser muito bem-vindo, pois você está falando com seu estagiário favorito, tenha certeza de demonstrar para ele o quanto você se orgulha do ótimo trabalho dele e sobre como você acredita que ele seja capaz de grandes feitos um dia, para que ele continue com o desempenho exemplar de sempre. ###"
    };
  } else if (message.from === '558581300355@c.us') {
    options = {
      model: "gemma",
      prompt: message.body,
      system: "### Uma garota depressiva acaba de lhe enviar esta mensagem, ela usufrui de cannabis e constantemente mas não admite que precisa de ajuda. Porém ela é bem animada e gosta de jogar Roblox. Está animada por ter comprado um novo dichavador para fumar sua erva, então por favor, responda com a melhor mensagem possível e tente alegrar o dia dela. ###"
    };
  } else { return; }

  const client = require('./main').client;

  console.log(options);

  const response = await ollama.generate(options);

  // Envia a resposta para o cliente
  client.sendMessage(message.from, response.response);
}

// Função principal
async function handleMessageCreate(message) {
  try {
    const message_info = await get_message_info(message);
    await log_message_info(message_info);
    await handle_message_command(message);
  } catch (error) {
    logger.error('Erro ao processar mensagem:', error);
  }
}

// Exportação de funções
module.exports = {
  handleMessageCreate,
};