const { Configuration, OpenAIApi } = require('openai');
const csv = require('csv-parser');
const fs = require('fs');

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY
});
const openai = new OpenAIApi(configuration);

const generateRecommendationPrompt = async (prompt) => {
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: prompt }
  ];
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    max_tokens: 200,
    temperature: 0.4
  });

  const generatedText = response.data.choices[0].message;
  console.log(generatedText);
  return generatedText;
};

const processData = (row, recommendation) => {
  const rowData = Object.values(row).join(', ');
  recommendation.push(rowData);
};

const generateFileRecommendation = async (req, res) => {
  const prompt = `Recommend list of twenty product copy WITHOUT DESCRIPTION using this data set, using format like this:
      These are the top 20 product copy based on the given data set:
      1. Product  
      2. Product  
      3. Product 
    `;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  const recommendation = [];

  const onCsvEnd = async () => {
    fs.unlinkSync(file.path); // Delete the uploaded file
    const combinedPrompt =
      prompt + '\nFile Content:\n' + recommendation.join('\n');
    const generatedInsights = await generateRecommendationPrompt(
      combinedPrompt
    );
    res.status(200).json({ recommendation: generatedInsights });
  };

  fs.createReadStream(file.path)
    .pipe(csv())
    .on('data', (row) => processData(row, recommendation))
    .on('end', onCsvEnd);
};

module.exports = { generateFileRecommendation };
