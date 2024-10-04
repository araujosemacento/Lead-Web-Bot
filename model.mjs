import ollama from 'ollama/browser'

const message = { role: 'user', content: 'Why is the sky blue?' }
const response = await ollama.chat({ model: 'ajindal/llama3.1-storm:8b', messages: [message], stream: true })
for await (const part of response) {
  process.stdout.write(part.message.content)
}