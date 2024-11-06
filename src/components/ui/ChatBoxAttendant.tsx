import React, { useState } from "react";

interface ChatBoxAttendantProps {
  role: "attendant";
  clientId: string;
  messages: { sender: string, text: string }[];
  onSendMessage: (message: string) => void;
}

const ChatBoxAttendant: React.FC<ChatBoxAttendantProps> = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg p-4">
      <div className="flex-1 overflow-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.sender === "client" ? "text-left" : "text-right"}`}
          >
            <div className={`inline-block ${msg.sender === "client" ? "bg-gray-100" : "bg-blue-100"} p-2 rounded-lg`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded-l-lg p-2"
          placeholder="Digite sua mensagem"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatBoxAttendant;