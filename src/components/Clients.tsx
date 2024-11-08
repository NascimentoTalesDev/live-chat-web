import { Client } from '@/app/chat/page'
import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Image from 'next/image'
import { getAllMessages } from '@/app/chat/actions'
import formatCharacterLimit from '@/lib/formatCharacterLimit'

interface ClientsProps {
    clients: Client[]
    clientId: string
    setClientId: (clientId: string) => void
    setMessages: (messages: { sender: string, text: string }[]) => void
}

const Clients = ({ clients, clientId, setClientId, setMessages }: ClientsProps) => {
    const [active, setActive] = useState("all")
    
    const handleClientClick = async (clientId: string) => {
        console.log("CHAT ID CLIENTS", clientId);
        
        const allMessages = await getAllMessages(clientId)
        setClientId(clientId);
        console.log("ALL MESSAGES", allMessages);
        
        setMessages(allMessages);  // Limpa o histórico de mensagens quando um novo cliente é selecionado
    };

    return (
        <div className="w-[350px] bg-white p-4 border-r-2">
            <h3 className="font-bold mb-4 text-lg">Chats</h3>
            <Input />
            <div className='flex my-3 items-center gap-3'>
                <Button onClick={() => setActive("all")} className={`rounded-3xl ${active === "all" && "bg-zinc-100"}`} variant={"ghost"}>Todos</Button>
                <Button onClick={() => setActive("unRead")} className={`rounded-3xl ${active === "unRead" && "bg-zinc-100"}`} variant={"ghost"}>Não Lidas</Button>
                <Button onClick={() => setActive("favorite")} className={`rounded-3xl ${active === "favorite" && "bg-zinc-100"}`} variant={"ghost"}>Favoritas</Button>
            </div>

            {active === "all" &&
                <>
                    {clients.length > 0 ? (
                        clients.map((client) => (
                            <div
                                key={client.id}
                                onClick={() => handleClientClick(client.chatId)}
                                className={`flex items-center cursor-pointer gap-2 p-2 h-18 border-b ${clientId === client.id ? "bg-gray-100" : "bg-white"}`}
                            >
                                <div>
                                    <Image src={''} alt='' height={50} width={50} />
                                </div>
                                <div >
                                    <div>
                                        <h2 className='font-bold'>
                                            {client.name}
                                        </h2>
                                    </div>
                                    <div>
                                        <span className='text-sm'>
                                            {formatCharacterLimit(26, client?.lastMessage)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum cliente conectado</p>
                    )}
                </>
            }
            {active === "unRead" && <>NÃO LIDAS</>}
            {active === "favorite" && <>FAVORITOS</>}

        </div>
    )
}

export default Clients
