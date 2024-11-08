// pages/attendant.tsx
"use client";

import { io, Socket } from "socket.io-client";
import React, { useState, useEffect } from "react";
import ChatBoxAttendant from "@/components/ui/ChatBoxAttendant";
import Clients from "@/components/Clients";

export interface Client {
    id: string;
    name: string;
    chatId: string;
    lastMessage: string;
}

const MessagesPage: React.FC = () => {
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

        // Atualiza a lista de clientes conectados quando o servidor envia os clientes
        socket.on("connectedClients", (clients: Client[]) => {
            setClients(clients);
        });

        // Lida com mensagens recebidas dos clientes
        socket.on("msgToAttendant", ({ message, clientId: msgClientId }) => {
            if (msgClientId === clientId) { // Adiciona a mensagem apenas se for do cliente selecionado
                setMessages(prevMessages => [
                    ...prevMessages,
                    { sender: "client", text: message },
                ]);
            }
            // Solicita a atualização da lista de clientes ao receber uma mensagem de um cliente
            socket.emit("getConnectedClients");
        });

        console.log("SOCKET", socket);

        return () => {
            socket.disconnect(); // Limpar a conexão WebSocket ao desmontar o componente
        };
    }, [role, clientId, messages]);


    // Envia uma mensagem do atendente para o cliente
    const handleSendMessage = (message: string) => {
        if (!message.trim() || !socket || !clientId) return;

        socket.emit("msgToClient", { message, clientId });
        setMessages(prevMessages => [
            ...prevMessages,
            { sender: "attendant", text: message, timestamp: Date.now() },
        ]);
    };

    return (
        <div className="flex h-full w-full">
            <Clients
                clients={clients}
                clientId={clientId ?? ""}
                setClientId={setClientId}
                setMessages={setMessages}
            />
            <div className="relative h-full w-full ">
                <div className="absolute top-0 right-0 h-full w-full chat-background opacity-10 -z-10"></div>
                <div className="h-full w-full">

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
        </div>
    );
};

export default MessagesPage;
