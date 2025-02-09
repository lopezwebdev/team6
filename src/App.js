import './App.css';

import { OpenAI } from "openai";

import { OAI_KEY } from './secrets';

async function callChat() {
  console.log(process.env.OPENAI_API_KEY)
  console.log('Test', process.env.VAR_A, process.env.VAR_B);

  const openai = new OpenAI({
    apiKey: OAI_KEY,
    dangerouslyAllowBrowser: true,
  });


  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: "Write a haiku about recursion in programming.",
      },
    ],
    store: true,
  });
  console.log(completion.choices[0].message);
}

function App() {

  return (
    <div className="App">
      hello
    </div>
  );
}

export default App;
