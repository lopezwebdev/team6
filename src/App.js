import React, { useState } from 'react';
import { OpenAI } from "openai";
import { OAI_KEY } from './secrets';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import hotel1 from "./hotel1.jpg"
import hotel2 from "./hotel2.jpg"

const hoteldata = [
  {
    image: hotel1,
    title: "Hotel 1",
    price: 0,
    url: "https://travel.rakuten.co.jp/HOTEL/18350/18350.html"
  },
  {
    image: hotel2,
    title: "Hotel 2",
    price: 1,
    url: "https://travel.rakuten.co.jp/HOTEL/20068/20068.html"
  }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const msgs = [
  {
    content: "Sure, here are hotels in Miura. Do you like it?",
    data: hoteldata,
    role: "system"
  },
  {
    content: "Sure! I'll proceed with booking.",
    role: "system",
    data: null
  }
];

function App() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Hi! Where would you like to go?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgCounter, setMsgCounter] = useState(0);
  const [iframeSrc, setIframeSrc] = useState("https://travel.rakuten.co.jp/");

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
    await sleep(1200)

    setMessages([...newMessages, msgs[msgCounter]]);
    setMsgCounter(msgCounter + 1);

    setLoading(false);
  };

  return (
    <div className="flex h-screen text-white p-0">
      <div className="w-3/5 h-full">
        <iframe
          title="Hotel Preview"
          src={iframeSrc}
          className="w-full h-full border-none rounded-lg"
        ></iframe>
      </div>
      <div className="w-2/5 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 max-w-xs md:max-w-md lg:max-w-lg rounded-lg ${msg.role === "user" ? "bg-blue-500 ml-auto" : "bg-gray-700 mr-auto"
                }`}
            >
              <div>{msg.content}</div>
              <div>
                {msg.data != null && (
                  <Carousel showThumbs={true} infiniteLoop autoPlay>
                    {msg.data.map((img, idx) => (
                      <div key={idx} onClick={() => setIframeSrc(img.url)} style={{ cursor: 'pointer' }}>
                        <img src={img.image} alt={img.title} width="100px" />
                        <p className="legend">{img.title}</p>
                      </div>
                    ))}
                  </Carousel>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg shadow-md">
          <input
            type="text"
            className="flex-1 p-2 bg-gray-700/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Where you wanna go?"
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
