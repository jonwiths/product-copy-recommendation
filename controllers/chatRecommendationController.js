const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY
});
const openai = new OpenAIApi(configuration);

const chatRecommedation = async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured properly'
      }
    });
    return;
  }

  const product = req.body.product || '';
  if (product.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Please enter a valid input'
      }
    });
    return;
  }

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: generateProductRecommendation(product) }
      ],
      temperature: 0.4,
      max_tokens: 250
    });
    res.status(200).send(response.data.choices[0].message);
    console.log(response.data.choices[0].message);
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.'
        }
      });
    }
  }
};

const generateProductRecommendation = (prompt) => {
  return `Recommend me twenty product copy of ${prompt} with NO description with this format:
  These are the top 20 product copy based on the given product:
  1. product_name
  2. product_name
  3. product_name`;
};

module.exports = { chatRecommedation };
