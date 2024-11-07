// components/ChatBoxClient.tsx

import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "./button";
import { Input } from "./input";

interface Message {
  sender: "client" | "attendant";
  text: string;
}

interface ChatBoxClientProps {
  role: "client" | "attendant";
  clientId?: string; // ID do cliente para que o atendente possa enviar respostas
}

const ChatBoxClient: React.FC<ChatBoxClientProps> = ({ role, clientId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Conectar ao servidor WebSocket
    const socket = io("http://localhost:8001", {
      query: { role },
    });

    setSocket(socket);

    // Definir evento para receber mensagens de clientes (para o atendente)
    socket.on("msgToAttendant", ({ message, clientId: senderClientId }) => {
      if (role === "attendant" && senderClientId === clientId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "client", text: message },
        ]);
      }
    });

    // Definir evento para receber mensagens de atendentes (para o cliente)
    socket.on("msgToClient", (message: string) => {
      if (role === "client") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "attendant", text: message },
        ]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [role, clientId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    if (role === "client" && socket) {
      socket.emit("msgToServer", newMessage); // Enviar mensagem para o atendente
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "client", text: newMessage },
      ]);
      setNewMessage("");
    }

    if (role === "attendant" && socket && clientId) {
      socket.emit("msgToClient", { message: newMessage, clientId }); // Enviar mensagem para o cliente
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "attendant", text: newMessage },
      ]);
      setNewMessage("");
    }
  };

  // Manipulador para enviar mensagem ao pressionar "Enter"
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div>
      <div
        style={{
          flex: 1,
          overflowY: "scroll",
          border: "1px solid #ccc",
          marginBottom: "10px",
          padding: "10px",
          height: "500px", // Ajuste a altura para limitar o chat
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              textAlign: message.sender === "client" ? "right" : "left",
            }}
          >
            <strong>{message.sender === "client" ? "Cliente:" : "Atendente:"}</strong>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          className="w-full border rounded-l-lg p-2"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Adiciona o manipulador para detectar "Enter"
          placeholder="Digite sua mensagem"
        />
        <Button className="bg-blue-500 text-white p-2 rounded-r-lg" onClick={handleSendMessage}>
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default ChatBoxClient;
