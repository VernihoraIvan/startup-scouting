import ollama from 'ollama';

async function handleCommand(prompt: string) {
  try {
    console.log('Sending prompt to Ollama...');
    const response = await ollama.chat({
      model: 'deepseek-r1:7b', // Or any other model you have installed
      messages: [{ role: 'user', content: prompt }],
    });
    console.log('Response from Ollama:');
    console.log(response.message.content);
  } catch (error) {
    console.error('Error communicating with Ollama:', error);
  }
}

export { handleCommand };
