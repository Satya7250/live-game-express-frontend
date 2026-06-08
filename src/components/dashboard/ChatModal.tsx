"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";

interface ChatModalProps {
  onClose: () => void;
}

export default function ChatModal({ onClose }: ChatModalProps) {
  const [messages, setMessages] = useState([
    { id: 1, sender: "You", text: "Hey! Want to play a game?", time: "2:30 PM" },
    { id: 2, sender: "Alex", text: "Sure! Which one?", time: "2:31 PM" },
    { id: 3, sender: "You", text: "Football championship tournament", time: "2:31 PM" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "You",
          text: input,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setInput("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-end">
      <div className="w-96 h-3/4 bg-white rounded-t-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="font-bold text-[#8f2c24]">Alex Johnson</h2>
            <p className="text-xs text-slate-500">Online</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === "You"
                    ? "bg-gradient-to-r from-[#8f2c24] to-[#d64c42] text-white"
                    : "bg-slate-100 text-slate-900"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === "You" ? "text-white/70" : "text-slate-500"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-slate-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-slate-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8f2c24]"
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-[#8f2c24] to-[#d64c42] text-white p-2 rounded-lg hover:shadow-lg transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
