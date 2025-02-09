import React, { useState } from 'react';
import { OpenAI } from "openai";
import { OAI_KEY } from './secrets';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import hotel1 from "./hotel1.jpg"

const hoteldata = [
  {
    image: hotel1,
    title: "asd",
    price: 0
  },
  {
    image: hotel1,
    title: "asd",
    price: 1
  }
]

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
      if (botMessage.content.includes("[carousel]")) {
        const images = [
          { src: "https://source.unsplash.com/400x300/?nature", title: "Nature" },
          { src: "https://source.unsplash.com/400x300/?city", title: "City" },
          { src: "https://source.unsplash.com/400x300/?ocean", title: "Ocean" },
        ];
        setMessages([...newMessages, { role: "assistant", content: "Here are some images:", images }]);
      } else {
        setMessages([...newMessages, botMessage]);
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white p-0">
      <div className="w-3/5 h-full">
        <iframe
          title="asd"
          src="https://travel.rakuten.co.jp/"
          className="w-full h-full border-none rounded-lg"
        ></iframe>
      </div>
      <div className="w-2/5 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 max-w-xs md:max-w-md lg:max-w-lg rounded-lg ${msg.role === "user" ? "bg-blue-500 ml-auto" : "bg-gray-700 mr-auto"}`}
            >
              <div>
                {msg.content}
              </div>
              <div>
                <Carousel showThumbs={true} infiniteLoop autoPlay>
                  {hoteldata.map((img, idx) => (
                    <div key={idx}>
                      <img src={img.image} alt={img.title} width="100px" />
                      <p className="legend">{img.title}</p>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg shadow-md">
          <input
            type="text"
            className="flex-1 p-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:bg-gray-500"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? "Loading..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
