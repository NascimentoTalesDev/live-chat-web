// pages/attendant.tsx
"use client";

import { io, Socket } from "socket.io-client";
import React, { useState, useEffect } from "react";
import ChatBoxAttendant from "@/components/ui/ChatBoxAttendant";

interface Client {
  id: string;
  name: string;
}

const AttendantPage: React.FC = () => {
  const [role] = useState<"attendant">("attendant");
  const [clientId, setClientId] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Criando a conexão WebSocket e manipulando as mensagens
  useEffect(() => {
    const socket = io("http://localhost:8001", {
      query: { role },
    });
    setSocket(socket);

    // Solicitar a lista de clientes conectados assim que a conexão for estabelecida
    socket.on("connect", () => {
      socket.emit("getConnectedClients");  // Solicita a lista de clientes conectados
    });

    // Atualiza a lista de clientes conectados
    socket.on("connectedClients", (clients: Client[]) => {
      setClients(clients);  
    });

    // Escutando as mensagens dos clientes
    socket.on("msgToAttendant", ({ message, clientId }) => {
      if (clientId === clientId) {  // Apenas adicionar a mensagem se for do cliente que o atendente selecionou
        setMessages(prevMessages => [
          ...prevMessages,
          { sender: "client", text: message },
        ]);
      }
    });

    return () => {
      socket.disconnect();  // Limpar a conexão WebSocket ao desmontar o componente
    };
  }, [role]);

  // Manipula a seleção do cliente
  const handleClientClick = (clientId: string) => {
    setClientId(clientId);
    setMessages([]);  // Limpa o histórico de mensagens quando um novo cliente é selecionado
  };

  // Envia uma mensagem do atendente para o cliente
  const handleSendMessage = (message: string) => {
    if (!message.trim() || !socket || !clientId) return;

    socket.emit("msgToClient", { message, clientId });
    setMessages(prevMessages => [
      ...prevMessages,
      { sender: "attendant", text: message },
    ]);
  };

  return (
    <div className="flex h-full w-full">
      {/* Lista de Clientes à Esquerda */}
      <div className="w-1/6 bg-red-400 p-4">
        <h3 className="font-bold mb-4">Clientes Conectados</h3>
        {clients.length > 0 ? (
          clients.map((client) => (
            <div
              key={client.id}
              onClick={() => handleClientClick(client.id)}
              className={`cursor-pointer p-2 border-b ${clientId === client.id ? "bg-gray-200" : "bg-white"}`}
            >
              {client.name}
            </div>
          ))
        ) : (
          <p>Nenhum cliente conectado</p>
        )}
      </div>

      {/* Área de Chat à Direita */}
      <div className="flex-1 p-4">
        {clientId ? (
          <div className="flex flex-col h-full">
            <ChatBoxAttendant
              role={role}
              clientId={clientId}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <h2>Selecione um cliente para conversar</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendantPage;
