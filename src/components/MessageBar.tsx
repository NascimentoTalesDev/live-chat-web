import EmojiPicker from "emoji-picker-react";
import { getAllMessagesSugestions } from '@/app/chat/actions';
import React, { useEffect, useRef, useState } from 'react';
import { Image as Photo, SendHorizonal, SmilePlus } from "lucide-react";

interface MessageBarProps {
    onSendMessage: (message: string) => void;
}

interface messagesSugestionsProps {
    text: string,
}

const MessageBar = ({ onSendMessage }: MessageBarProps) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState("");
    const [query, setQuery] = useState('');
    const [messagesSugestions, setMessagesSugestions] = useState<messagesSugestionsProps[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Estado para controlar o índice da sugestão selecionada
    const emojiPickerRef = useRef<HTMLDivElement | null>(null);
    const emojiButtonRef = useRef<HTMLDivElement>(null); // Referência do botão de abrir emoji
    const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Referência para o textarea

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setQuery("");
            setMessage("");
        }
    };

    const selectSugestion = (sugestion: string) => {
        setQuery(""); // Limpa a pesquisa
        setMessage(sugestion); // Define a sugestão como a mensagem
        setSelectedIndex(null); // Reseta o índice selecionado
    };

    const newMessage = (emoji: string) => {
        setMessage((prev) => prev + emoji); // Adiciona o emoji à mensagem atual
    };

    const handleEmogiModal = () => {
        setShowEmojiPicker((prev) => !prev); // Alterna a visibilidade do picker
    };

    const fetchSuggestions = async (query: string) => {
        if (!query) return setMessagesSugestions([]); // Se não houver consulta, limpa as sugestões

        const allsugestion = await getAllMessagesSugestions(query);
        setMessagesSugestions(allsugestion);
    };

    const setItem = (event: string) => {
        setMessage(event);
        setQuery(event); // Define o valor de query e mensagem ao digitar
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSuggestions(query);
        }, 300);

        return () => clearTimeout(timeoutId); // Limpa o timeout ao mudar a query
    }, [query]);

    useEffect(() => {
        const handleOutsideClickEmoji = (event: MouseEvent) => {
            // Fecha o emoji picker se o clique for fora do picker ou do botão de abrir
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node) && // Verifica se o clique foi fora do picker
                emojiButtonRef.current &&
                !emojiButtonRef.current.contains(event.target as Node) // Verifica se o clique foi fora do botão de abrir emoji
            ) {
                setShowEmojiPicker(false); // Fecha o emoji picker
            }
        };

        // Adiciona o evento de clique
        document.addEventListener("click", handleOutsideClickEmoji);

        // Remove o evento quando o componente for desmontado
        return () => {
            document.removeEventListener("click", handleOutsideClickEmoji);
        };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Impede o envio do formulário
            if (selectedIndex !== null) {
                // Se estiver navegando nas sugestões, envia a sugestão selecionada
                selectSugestion(messagesSugestions[selectedIndex].text);
                onSendMessage(messagesSugestions[selectedIndex].text); // Envia a sugestão
                setMessage(""); // Limpa a mensagem
            } else if (message.trim()) {
                // Se não houver sugestão selecionada, envia a mensagem normal
                onSendMessage(message);
                setMessage(""); // Limpa o campo de mensagem
            }
            return;
        }
    
        if (e.key === 'Enter' && e.shiftKey) {
            e.preventDefault(); // Impede o envio do formulário
            if (textareaRef.current) {
                const currentPos = textareaRef.current.selectionStart;
                setMessage((prevMessage) => prevMessage.slice(0, currentPos) + '\n' + prevMessage.slice(currentPos)); // Adiciona uma nova linha à mensagem
                setTimeout(() => {
                    if (textareaRef.current) {
                        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = currentPos + 1; // Mantém o foco na linha de baixo
                        textareaRef.current.scrollTop = textareaRef.current.scrollHeight; // Rolagem para a linha de baixo
                    }
                }, 0);
            }
            return;
        }
    
        if (messagesSugestions.length === 0) return;
    
        if (e.key === 'ArrowDown') {
            setSelectedIndex((prevIndex) =>
                prevIndex === null ? 0 : Math.min(prevIndex + 1, messagesSugestions.length - 1)
            );
        } else if (e.key === 'ArrowUp') {
            setSelectedIndex((prevIndex) =>
                prevIndex === null ? 0 : Math.max(prevIndex - 1, 0)
            );
        } else if (e.key === 'Enter' && selectedIndex !== null) {
            // Se estiver navegando nas sugestões e pressionar Enter, seleciona a sugestão
            selectSugestion(messagesSugestions[selectedIndex].text);
            onSendMessage(messagesSugestions[selectedIndex].text); // Envia a sugestão selecionada
            setMessage(""); // Limpa a mensagem
        }
    };
    

    return (
        <label htmlFor="message" className="w-full p-4 bg-slate-100 flex items-center h-24 border">
            <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
                <label htmlFor="emoji-open">
                    <div
                        title="Emoji"
                        className="cursor-pointer"
                        id="emoji-open"
                        onClick={handleEmogiModal}  // Quando o ícone for clicado, alterna a visibilidade do emoji picker
                        ref={emojiButtonRef} // Referência do botão para verificação de cliques fora
                    >
                        <SmilePlus />
                    </div>

                    {showEmojiPicker && (
                        <div ref={emojiPickerRef} className="absolute bottom-20 left-4">
                            <EmojiPicker onEmojiClick={(e) => newMessage(e.emoji)} />
                        </div>
                    )}
                </label>
                <div>
                    <label htmlFor="avatar" className="cursor-pointer">
                        <Photo />
                    </label>

                    <input className="hidden" type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />
                </div>
                <div className="w-full flex">
                    <ul className='absolute bottom-28 py-2 rounded-md bg-slate-50 w-fit'>
                        {messagesSugestions.length > 0 && messagesSugestions.map((suggestion, index) => (
                            <li 
                                value={suggestion?.text} 
                                onClick={() => selectSugestion(suggestion?.text)} 
                                key={index} 
                                className={`flex p-2 gap-2 mb-1 rounded-md cursor-pointer 
                                    ${selectedIndex === index ? 'bg-zinc-200' : 'hover:bg-zinc-200'}`} // Adiciona a classe de destaque para a sugestão selecionada
                            >
                                <div className='rounded-full px-2 gap-2 bg-slate-400'>
                                    {index + 1}
                                </div>
                                <div>
                                    {suggestion?.text}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <textarea
                        ref={textareaRef}
                        value={message}
                        id="message"
                        autoComplete="off"
                        onChange={(e) => setItem(e.target.value)}
                        onKeyDown={handleKeyDown} // Adiciona o manipulador de teclado
                        className="w-full border rounded-l-lg p-2"
                        placeholder="Digite sua mensagem"
                    />
                    <button type="submit" className="flex items-center gap-2 bg-blue-500 text-white p-2 rounded-r-lg">
                        <SendHorizonal />
                        <span>Enviar</span>
                    </button>
                </div>
            </form>
        </label>
    );
}

export default MessageBar;
