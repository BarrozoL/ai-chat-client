import React, { useState } from "react";
import axios from "axios";

export default function Homepage() {
  const [messages, setMessages] = useState([]); // Each message: { role: 'user' | 'ai', text: string }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Save the user's message
    const userMessage = { role: "user", text: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send the message to your server endpoint
      const response = await axios.post(
        "https://ai-chat-server-624z.onrender.com/ai/ai-chat",
        {
          message: trimmedInput,
        }
      );
      const reply = response.data.reply;
      const aiMessage = { role: "ai", text: reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "ai",
        text: "Sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <h1 className="text-3xl font-bold text-center mb-4">Chat-Barrozo</h1>

      {/* Chat messages container */}
      <div className="flex-1 border rounded-lg p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs p-2 rounded-lg bg-gray-200 text-gray-800">
              Typing...
            </div>
          </div>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSend} className="mt-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
}
