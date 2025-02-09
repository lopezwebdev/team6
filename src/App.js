import React, { useState } from 'react';
import { OpenAI } from "openai";
import { OAI_KEY } from './secrets';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const callOpenAI = async (newMessages) => {
    try {
      const openai = new OpenAI({
        apiKey: OAI_KEY,
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: newMessages,
      });

      return completion.choices[0].message;
    } catch (error) {
      console.error("Error calling API:", error);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const botMessage = await callOpenAI(newMessages);
    if (botMessage) {
      setMessages([...newMessages, botMessage]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "user-message" : "bot-message"}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Loading..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
