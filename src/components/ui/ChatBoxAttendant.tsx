import EmojiPicker from "emoji-picker-react";
import { Image as Photo, SendHorizonal, SmilePlus } from "lucide-react";
import React, { useState } from "react";

interface ChatBoxAttendantProps {
  messages: { sender: string, text: string }[];
  onSendMessage: (message: string) => void;
}

const ChatBoxAttendant: React.FC<ChatBoxAttendantProps> = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const newMessage = (emoji: string) => {
    setMessage((prev) => prev + emoji)
  };

  const handleEmogiModal = () => {
    setShowEmojiPicker(!showEmojiPicker)
  };

  return (
    <div className="flex flex-col h-full border rounded-lg">
      <div className="flex-1 overflow-auto mb-4 p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.sender === "client" ? "text-left" : "text-right"}`}
          >
            <div className={`inline-block ${msg.sender === "client" ? "bg-zinc-300" : "bg-red-500"} p-2 rounded-lg`}>
              <div className="flex gap-2">
                <p>{msg.text}</p>
                <span className="block text-xs text-gray-600 mt-1">
                  Data
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <label htmlFor="message" className="w-full p-4 bg-slate-100 flex items-center h-24 border">
        <div className=" w-full">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
            <div onClick={handleEmogiModal}>
              <SmilePlus />
            </div>
            {showEmojiPicker && (
              <div className="absolute bottom-20 left-4">
                <EmojiPicker onEmojiClick={(e) => newMessage(e.emoji)} />
              </div>
            )}
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
                id="message"
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-l-lg p-2 "
                placeholder="Digite sua mensagem"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">
                <SendHorizonal />
              </button>
            </div>
          </form>
        </div>
      </label>
    </div>
  );
};

export default ChatBoxAttendant;