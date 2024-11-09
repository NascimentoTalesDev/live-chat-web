import EmojiPicker from "emoji-picker-react";
import { getAllMessagesSugestions } from '@/app/chat/actions';
import React, { useEffect, useRef, useState } from 'react'
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
    const emojiPickerRef = useRef<HTMLDivElement | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setQuery("")
            setMessage("");
        }
    };

    const selectSugestion = (sugestion: string) => {
        setQuery("")
        setMessage("")
        setMessage(sugestion)
    };

    const newMessage = (emoji: string) => {
        setMessage((prev) => prev + emoji)
    };

    const handleEmogiModal = () => {
        setShowEmojiPicker(!showEmojiPicker)
    };

    const fetchSuggestions = async (query: string) => {
        if (!query) return setMessagesSugestions([])

        const allsugestion = await getAllMessagesSugestions(query)
        setMessagesSugestions(allsugestion);
    };

    const setItem = async (event: string) => {
        setMessage(event)
        setQuery(event)
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSuggestions(query);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);
    
    useEffect(() => {
        const handleOutsideClickEmoji = (event: MouseEvent) => {
            if (event.target && !emojiPickerRef.current?.contains(event.target as Node) && (event.target as HTMLElement).id !== "emoji-open") {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener("click", handleOutsideClickEmoji);
        
        return () => {
            document.removeEventListener("click", handleOutsideClickEmoji);
        };
    }, []);

    return (
        <label htmlFor="message" className="w-full p-4 bg-slate-100 flex items-center h-24 border">
            <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
                <div title="Emoji" className="cur" id="emoji-open" onClick={handleEmogiModal}>
                    <SmilePlus />
                </div>
                {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-20 left-4">
                        <EmojiPicker  onEmojiClick={(e) => newMessage(e.emoji)} />
                    </div>
                )}
                <div>
                    <label htmlFor="avatar" className="cursor-pointer">
                        <Photo />
                    </label>

                    <input className="hidden" type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />

                </div>
                <div className="w-full flex">
                    <ul className='absolute bottom-28 py-2 rounded-md bg-slate-50 w-fit'>
                        {messagesSugestions.map((suggestion, index) => (
                            <li value={suggestion?.text} onClick={() => selectSugestion(suggestion?.text)} key={index} className='flex p-2 gap-2 mb-1 hover:bg-zinc-200 rounded-md cursor-pointer'>
                                <div className='rounded-full px-2 gap-2 bg-slate-400'>
                                    {index + 1}
                                </div>
                                <div>
                                    {suggestion?.text}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={message}
                        id="message"
                        autoComplete="off"
                        onChange={(e) => setItem(e.target.value)}
                        className="w-full border rounded-l-lg p-2 "
                        placeholder="Digite sua mensagem"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">
                        <SendHorizonal />
                    </button>
                </div>
            </form>
        </label>
    )
}

export default MessageBar
