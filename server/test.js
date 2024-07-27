const path = require('path');
const dotenv = require('dotenv');

// Load .env file from two directories up
const result = dotenv.config({ path: path.join(__dirname, '..', '.env') });
if (result.error) {
  console.error("Error loading .env file:", result.error);
} else {
  console.log(".env file loaded successfully");
}

const { Configuration, OpenAIApi } = require("openai");

// Log the API key (first 10 characters)
console.log("OPENAI_API_KEY (first 10 characters):", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) : "Not set");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function testOpenAI() {
  try {
    console.log("Attempting to call OpenAI API...");
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello, OpenAI!" }],
    });
    console.log("OpenAI test successful. Response:", completion.data.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI test failed:");
    if (error.response) {
      console.error("Error response:", error.response.data);
      console.error("Error status:", error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up the request:", error.message);
    }
  }
}

testOpenAI();