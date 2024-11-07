import { Image as Photo } from "lucide-react";
import React, { useState } from "react";

interface ChatBoxAttendantProps {
  role: "attendant";
  clientId: string;
  messages: { sender: string, text: string, timestamp: Date }[];
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
            <div className={`inline-block ${msg.sender === "client" ? "bg-zinc-300" : "bg-red-500"} p-2 rounded-lg`}>
              <div className="flex gap-2">
                <p>{msg.text}</p>
                <span className="block text-xs text-gray-600 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
        <div>
          EM
        </div>
        <div>
          <label htmlFor="avatar" className="cursor-pointer">
            <Photo />
          </label>

          <input className="hidden" type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />

        </div>
        <div className="w-full flex">

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
        </div>
      </form>
    </div>
  );
};

export default ChatBoxAttendant;