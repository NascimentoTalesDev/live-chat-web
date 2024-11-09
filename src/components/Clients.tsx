import { Client } from '@/app/chat/page'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Image from 'next/image'
import { getAllMessages } from '@/app/chat/actions'
import formatCharacterLimit from '@/lib/formatCharacterLimit'

interface ClientsProps {
    chats: Chats[]
    clients: Client[]
    clientId: string
    setClientId: (clientId: string) => void
    setMessages: (messages: { sender: string, text: string }[]) => void
}

const Clients = ({ chats, clients, clientId, setClientId, setMessages }: ClientsProps) => {
    const [active, setActive] = useState("all")

    const handleClientClick = async (clientId: string) => {
        const allMessages = await getAllMessages(clientId)
        setClientId(clientId);
        setMessages(allMessages);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setClientId(""); // Set clientId to empty string
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [setClientId]);

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
                    {chats.length > 0 ? (chats.map((chat) => (
                        <div key={chat.id} onClick={() => handleClientClick(chat.id)} className={`flex items-center cursor-pointer gap-2 p-2 h-18 border-b ${clientId === chat.id ? "bg-gray-100" : "bg-white"}`} >
                            <div>
                                <Image src={''} alt='' height={50} width={50} />
                            </div>
                            <div >
                                <div>
                                    <h2 className='font-bold'>
                                        {chat.User.name}
                                    </h2>
                                </div>
                                <div>
                                    <span className='text-sm'>
                                        {clients
                                            .filter(client => client.chatId === chat.id) // Filtro aplicado diretamente
                                            .map(client => (
                                                <span key={client.id}>{formatCharacterLimit(26, client?.lastMessage)}</span>
                                            ))}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                    ) : (
                        <p>Nenhum chat conectado</p>
                    )}
                </>
            }
            {active === "unRead" &&
                <>
                    {clients.length > 0 ? (
                        clients.map((client) => (
                            <div
                                key={client.id}
                                onClick={() => handleClientClick(client.chatId)}
                                className={`flex items-center cursor-pointer gap-2 p-2 h-18 border-b ${clientId === client.chatId ? "bg-gray-100" : "bg-white"}`}
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
                        <p>Nenhuma mensagem encontrada</p>
                    )}
                </>
            }
            {active === "favorite" && <>Você ainda não tem favoritas</>}

        </div>
    )
}

export default Clients
