import EmojiPicker from "emoji-picker-react";
import { Image as Photo, SendHorizonal, SmilePlus } from "lucide-react";
import React, { useState } from "react";
import SmartInput from "../SmartInput";

interface ChatBoxAttendantProps {
  messages: { sender: string, text: string }[];
  onSendMessage: (message: string) => void;
}

const ChatBoxAttendant: React.FC<ChatBoxAttendantProps> = ({ messages, onSendMessage }) => {

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
      <div className="w-full">
        <SmartInput onSendMessage={onSendMessage} />
      </div>
      
    </div>
  );
};

export default ChatBoxAttendant;