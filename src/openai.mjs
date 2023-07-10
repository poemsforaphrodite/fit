import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey:"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",
});

const openai = new OpenAIApi(configuration);

async function getResponse() {
    const completion = await openai.createChatCompletion({
        model:"gpt-3.5-turbo",
        messages:[
            {role:"user", content:"Hello, who are you?"},
        ]
    });

    console.log(completion.data.choices[0].message.content);
}
getResponse();
